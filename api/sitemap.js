import { fetchPublishedArticlesForSitemap, generateSitemapXml } from "../server/seo.js";

const VERCEL_SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://dubai-startups-daily.vercel.app").replace(/\/$/, "");

export default async function handler(_req, res) {
  const articles = await fetchPublishedArticlesForSitemap();
  const xml = generateSitemapXml(articles, VERCEL_SITE_URL);

  res.status(200);
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  res.send(xml);
}
