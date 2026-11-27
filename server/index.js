// Dubai Startups Daily CMS server: JSON API + image uploads + (in production) the built site.
import express from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as store from "./store.js";
import { validateArticle } from "./validate.js";
import { checkPassword, issueToken, requireAuth, loginLimiter, verifyToken, usingDefaultPassword } from "./auth.js";
import { generateSitemapXml, renderRouteHtml } from "./seo.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8787;
const UPLOAD_DIR = path.join(store.DATA_DIR, "uploads");
const DIST = path.join(here, "..", "dist");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10mb" }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------- Auth ---------- */
app.post("/api/login", loginLimiter, (req, res) => {
  if (!checkPassword(req.body?.password)) {
    req.recordFailure();
    return res.status(401).json({ error: "That password isn’t right." });
  }
  req.clearFailures();
  res.json({ token: issueToken() });
});

app.get("/api/session", (req, res) => {
  const token = (req.get("authorization") || "").replace(/^Bearer /, "");
  res.json({ ok: verifyToken(token) });
});

/* ---------- Articles ---------- */
app.get("/api/articles", (_req, res) => {
  res.set("Cache-Control", "no-store").json(store.list());
});

app.get("/api/articles/:slug", (req, res) => {
  const a = store.get(req.params.slug);
  if (!a) return res.status(404).json({ error: "Story not found." });
  res.json(a);
});

app.post(
  "/api/articles",
  requireAuth,
  wrap((req, res) => {
    const { value, errors } = validateArticle(req.body);
    if (Object.keys(errors).length) return res.status(422).json({ error: "Fix the highlighted fields.", errors });
    res.status(201).json(store.create(value));
  })
);

app.put(
  "/api/articles/:slug",
  requireAuth,
  wrap((req, res) => {
    const { value, errors } = validateArticle(req.body);
    if (Object.keys(errors).length) return res.status(422).json({ error: "Fix the highlighted fields.", errors });
    const saved = store.update(req.params.slug, value);
    if (!saved) return res.status(404).json({ error: "Story not found." });
    res.json(saved);
  })
);

app.delete("/api/articles/:slug", requireAuth, (req, res) => {
  if (!store.remove(req.params.slug)) return res.status(404).json({ error: "Story not found." });
  res.status(204).end();
});

/* ---------- Uploads (base64 JSON, images only) ---------- */
const MIME = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };
const MAX_BYTES = 6 * 1024 * 1024;

app.post("/api/uploads", requireAuth, (req, res) => {
  const match = /^data:([\w/+.-]+);base64,(.+)$/.exec(req.body?.data || "");
  if (!match || !MIME[match[1]]) return res.status(415).json({ error: "Upload a JPG, PNG, WebP, GIF or AVIF image." });
  const buf = Buffer.from(match[2], "base64");
  if (buf.length > MAX_BYTES) return res.status(413).json({ error: "Images must be under 6 MB." });
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}.${MIME[match[1]]}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
  res.status(201).json({ url: `/uploads/${name}` });
});

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "30d", immutable: true }));

/* ---------- Technical SEO & Sitemaps ---------- */
app.get("/robots.txt", (_req, res) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`User-agent: *
Allow: /
Allow: /article/
Allow: /category/
Allow: /setup
Allow: /events
Allow: /jobs
Allow: /about
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /search

Sitemap: https://dubai-startups-daily.vercel.app/sitemap.xml
`);
});

app.get("/sitemap.xml", (_req, res) => {
  res.set("Content-Type", "application/xml; charset=utf-8");
  res.set("Cache-Control", "public, max-age=300");
  res.send(generateSitemapXml(store.list()));
});

app.get("/sitemap-news.xml", (_req, res) => {
  res.status(404).set("Content-Type", "text/plain; charset=utf-8").send("Not found.");
});

/* ---------- Built site with Dynamic Server-Side SEO Prerender ---------- */
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST, { index: false }));

  app.get(/^(?!\/api\/).*/, (req, res) => {
    try {
      const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
      const { status, html } = renderRouteHtml(template, req.path, {
        getArticle: store.get,
        getArticles: store.list,
      });
      res.status(status).send(html);
    } catch {
      res.sendFile(path.join(DIST, "index.html"));
    }
  });
}

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === "entity.too.large") return res.status(413).json({ error: "That upload is too large." });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Something went wrong on the server." : err.message, field: err.field });
});

app.listen(PORT, () => {
  console.log(`[cms] API on http://localhost:${PORT}/api`);
  if (usingDefaultPassword) {
    console.log('[cms] Admin password is the development default "dsd-admin". Set ADMIN_PASSWORD before deploying.');
  }
});
