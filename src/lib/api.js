// Thin client for the CMS API.
const TOKEN_KEY = "dsd_admin_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
};

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors || {};
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  let res;
  try {
    res = await fetch(path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Can’t reach the CMS server. Is it running?", 0);
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) setToken(null);
    const errors = data.errors || (data.field ? { [data.field]: data.error } : undefined);
    throw new ApiError(data.error || `Request failed (${res.status}).`, res.status, errors);
  }
  return data;
}

export const api = {
  articles: () => request("/api/articles"),
  login: (password) => request("/api/login", { method: "POST", body: { password } }),
  session: () => request("/api/session", { auth: true }),
  create: (article) => request("/api/articles", { method: "POST", body: article, auth: true }),
  update: (slug, article) => request(`/api/articles/${encodeURIComponent(slug)}`, { method: "PUT", body: article, auth: true }),
  remove: (slug) => request(`/api/articles/${encodeURIComponent(slug)}`, { method: "DELETE", auth: true }),
  upload: (dataUrl) => request("/api/uploads", { method: "POST", body: { data: dataUrl }, auth: true }),
};
