import { HTML_TEMPLATE } from "./_template.js";
import { renderRouteHtml, getLocalArticleBySlug, getLocalArticlesForSitemap } from "../server/seo.js";

export default async function handler(req, res) {
  const rawPath =
    typeof req.query?.path === "string" && req.query.path
      ? req.query.path
      : new URL(req.url || "/", "https://dubai-startups-daily.vercel.app").pathname;

  const normalized = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  if (normalized === "/sitemap-news.xml") {
    res.status(404);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.send("Not found.");
    return;
  }

  const { status, html } = renderRouteHtml(HTML_TEMPLATE, normalized, {
    getArticle: getLocalArticleBySlug,
    getArticles: getLocalArticlesForSitemap,
  });

  res.status(status);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (status === 404 || normalized.startsWith("/admin") || normalized === "/search") {
    res.setHeader("Cache-Control", "no-store");
  } else {
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  }
  res.send(html);
}
