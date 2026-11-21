// Single-admin auth: password from env, stateless HMAC-signed tokens.
import crypto from "node:crypto";

const DEFAULT_PASSWORD = "dsd-admin";
export const PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
export const usingDefaultPassword = !process.env.ADMIN_PASSWORD;

const SECRET =
  process.env.SESSION_SECRET || crypto.createHash("sha256").update(`dsd:${PASSWORD}`).digest("hex");
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const b64 = (s) => Buffer.from(s).toString("base64url");
const sign = (data) => crypto.createHmac("sha256", SECRET).update(data).digest("base64url");

const safeEqual = (a, b) => {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

export const checkPassword = (pw) => safeEqual(pw || "", PASSWORD);

export function issueToken() {
  const payload = b64(JSON.stringify({ sub: "admin", exp: Date.now() + TTL_MS }));
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!safeEqual(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) return res.status(401).json({ error: "Your session has expired. Sign in again." });
  next();
}

// Basic brute-force brake: 8 failed attempts per IP per 15 minutes.
const attempts = new Map();
export function loginLimiter(req, res, next) {
  const key = req.ip;
  const entry = attempts.get(key) || { n: 0, reset: Date.now() + 15 * 60 * 1000 };
  if (Date.now() > entry.reset) {
    entry.n = 0;
    entry.reset = Date.now() + 15 * 60 * 1000;
  }
  if (entry.n >= 8) return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
  req.recordFailure = () => attempts.set(key, { ...entry, n: entry.n + 1 });
  req.clearFailures = () => attempts.delete(key);
  next();
}
