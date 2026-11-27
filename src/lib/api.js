import { supabase, hasSupabaseConfig } from "./supabase";

// Thin client for the CMS API & read-only Supabase article source.
const TOKEN_KEY = "dsd_admin_token";
const WEBSITE_SLUG = "dubai-startups-daily";
const CATEGORY_MAP = {
  "startup-ecosystem": "startup-news",
  "funding-investment": "funding-investment",
  "founders-leadership": "founder-stories",
  "startup-programs-events": "insights-analysis",
  "business-entrepreneurship": "business-news",
  "startup-technology": "technology-ai",
};

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

function toBlocks(content) {
  if (Array.isArray(content)) {
    return content
      .map((b) => ({ t: b?.t === "h" || b?.t === "q" ? b.t : "p", x: String(b?.x || "").trim() }))
      .filter((b) => b.x);
  }
  if (typeof content !== "string") return [];
  const trimmed = content.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return toBlocks(parsed);
    } catch {
      // fall through to text parsing
    }
  }
  const normalized = trimmed
    .replace(/<\/(p|div|h[1-6]|blockquote|li)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return normalized
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (/^#{1,6}\s+/.test(chunk)) return { t: "h", x: chunk.replace(/^#{1,6}\s+/, "").trim() };
      if (/^>\s+/.test(chunk)) return { t: "q", x: chunk.replace(/^>\s+/, "").trim() };
      return { t: "p", x: chunk };
    });
}

function estimateReadTime(blocks) {
  const words = blocks.reduce((sum, b) => sum + (b.x ? b.x.split(/\s+/).length : 0), 0);
  return Math.max(1, Math.round(words / 200));
}

function mapSupabaseArticle(row) {
  const blocks = toBlocks(row.content);
  const rawDate = row.published_at || row.created_at || new Date().toISOString();
  const dbCatSlug = row.category?.slug || "";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.excerpt || row.meta_description || "",
    category: CATEGORY_MAP[dbCatSlug] || "startup-news",
    author: "Dubai Startups Daily",
    authorRole: "Editorial Desk",
    date: String(rawDate).slice(0, 10),
    publishedAt: row.published_at || row.created_at || null,
    updatedAt: row.updated_at || row.published_at || row.created_at || null,
    readTime: estimateReadTime(blocks),
    image: row.featured_image || "",
    imageCaption: "",
    tags: [],
    blocks,
    seoTitle: row.seo_title || row.title,
    metaDescription: row.meta_description || row.excerpt || "",
    status: row.status,
  };
}

async function fetchPublishedArticles() {
  if (!hasSupabaseConfig || !supabase) {
    throw new ApiError("Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.", 0);
  }

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("id")
    .eq("slug", WEBSITE_SLUG)
    .eq("is_active", true)
    .maybeSingle();

  if (websiteError) {
    throw new ApiError(websiteError.message || "Failed to load website configuration from Supabase.", 500);
  }
  if (!website) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, website_id, category_id, title, slug, excerpt, content, featured_image, status, seo_title, meta_description, published_at, created_at, updated_at, category:website_categories!articles_category_id_fkey(slug, name)"
    )
    .eq("website_id", website.id)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError(error.message || "Failed to load articles from Supabase.", 500);
  }

  return (data || []).map(mapSupabaseArticle);
}

export const api = {
  articles: fetchPublishedArticles,
  login: (password) => request("/api/login", { method: "POST", body: { password } }),
  session: () => request("/api/session", { auth: true }),
  create: (article) => request("/api/articles", { method: "POST", body: article, auth: true }),
  update: (slug, article) => request(`/api/articles/${encodeURIComponent(slug)}`, { method: "PUT", body: article, auth: true }),
  remove: (slug) => request(`/api/articles/${encodeURIComponent(slug)}`, { method: "DELETE", auth: true }),
  upload: (dataUrl) => request("/api/uploads", { method: "POST", body: { data: dataUrl }, auth: true }),
};
