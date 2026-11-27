// Server-side SEO generator: XML sitemaps + HTML meta & Schema.org injection.
import { CATEGORIES } from "../src/data/categories.js";

const SITE_NAME = "Dubai Startups Daily";
const SITE_URL = (process.env.SITE_URL || "https://dubaistartupsdaily.ae").replace(/\/$/, "");

const escapeXml = (unsafe = "") =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Generate complete XML Sitemap including all pages, categories, and articles
 */
export function generateSitemapXml(articles = []) {
  const now = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { loc: `${SITE_URL}/`, changefreq: "hourly", priority: "1.0", lastmod: now },
    { loc: `${SITE_URL}/setup`, changefreq: "weekly", priority: "0.9", lastmod: now },
    { loc: `${SITE_URL}/events`, changefreq: "daily", priority: "0.9", lastmod: now },
    { loc: `${SITE_URL}/jobs`, changefreq: "daily", priority: "0.9", lastmod: now },
    { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.6", lastmod: now },
  ];

  const categoryRoutes = CATEGORIES.map((c) => ({
    loc: `${SITE_URL}/category/${c.slug}`,
    changefreq: "daily",
    priority: "0.8",
    lastmod: now,
  }));

  const articleRoutes = articles.map((a) => ({
    loc: `${SITE_URL}/article/${a.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: a.updatedAt ? a.updatedAt.split("T")[0] : a.date || now,
  }));

  const allUrls = [...staticRoutes, ...categoryRoutes, ...articleRoutes];

  const xmlEntries = allUrls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

/**
 * Generate Google News XML Sitemap for recently published articles (last 48 hours / recent)
 */
export function generateNewsSitemapXml(articles = []) {
  // Sort articles descending by date
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  // Take top 50 recent articles
  const recentArticles = sorted.slice(0, 50);

  const xmlEntries = recentArticles
    .map((a) => {
      const pubDate = a.date ? `${a.date}T07:00:00+04:00` : new Date().toISOString();
      return `  <url>
    <loc>${escapeXml(`${SITE_URL}/article/${a.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(a.seoTitle || a.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlEntries}
</urlset>`;
}

/**
 * Server-Side Prerender / Head Injector for production Express
 */
export function injectPrerenderedHtml(htmlTemplate, reqPath, article = null) {
  let title = "Dubai Startups Daily · The Daily Pulse of Dubai’s Startup Ecosystem";
  let description =
    "The Daily Pulse of Dubai’s Startup Ecosystem. Breaking news on seed-to-growth funding rounds, AI, venture capital, business setup, tech events, and startup jobs in Dubai.";
  let canonical = `${SITE_URL}${reqPath}`;
  let ogType = "website";
  let ogImage = `${SITE_URL}/favicon.svg`;
  let noindex = reqPath.startsWith("/admin") || reqPath.startsWith("/search");
  let jsonLd = null;
  let noscriptContent = "";

  if (reqPath.startsWith("/article/") && article) {
    title = `${article.seoTitle || article.title} · ${SITE_NAME}`;
    description = article.metaDescription || article.dek;
    canonical = `${SITE_URL}/article/${article.slug}`;
    ogType = "article";
    ogImage = article.image
      ? article.image.startsWith("http")
        ? article.image
        : `${SITE_URL}${article.image.startsWith("/") ? "" : "/"}${article.image}`
      : `${SITE_URL}/favicon.svg`;

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.seoTitle || article.title,
      description: article.metaDescription || article.dek,
      image: [ogImage],
      datePublished: `${article.date}T07:00:00+04:00`,
      dateModified: article.updatedAt || `${article.date}T07:00:00+04:00`,
      author: {
        "@type": "Person",
        name: article.author || "Editorial Desk",
        jobTitle: article.authorRole || "Journalist",
      },
      publisher: {
        "@type": "NewsMediaOrganization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
      },
      mainEntityOfPage: canonical,
    };

    noscriptContent = `<article style="max-width:800px;margin:2rem auto;padding:1rem;">
      <h1>${escapeXml(article.title)}</h1>
      <p style="font-size:1.2rem;color:#666;">${escapeXml(article.dek)}</p>
      <p><small>By ${escapeXml(article.author)} · ${escapeXml(article.date)}</small></p>
      <div>${(article.blocks || [])
        .map((b) => (b.t === "h" ? `<h2>${escapeXml(b.x)}</h2>` : `<p>${escapeXml(b.x)}</p>`))
        .join("")}</div>
    </article>`;
  } else if (reqPath === "/setup" || reqPath === "/guides") {
    title = `Dubai Business Setup & Playbooks · ${SITE_NAME}`;
    description = "Step-by-step guides for launching a startup in Dubai: DIFC vs. DMCC vs. Mainland, corporate banking with Wio, and the 10-Year UAE Golden Visa.";
    canonical = `${SITE_URL}/setup`;
  } else if (reqPath === "/events") {
    title = `Dubai Startup & Tech Events Calendar · ${SITE_NAME}`;
    description = "Curated calendar of venture pitch nights, angel circles, demo days, and tech summits across Dubai.";
    canonical = `${SITE_URL}/events`;
  } else if (reqPath === "/jobs") {
    title = `Dubai Startup Jobs Board · ${SITE_NAME}`;
    description = "Verified engineering, product, marketing, and operations roles at high-growth Dubai startups with transparent AED compensation.";
    canonical = `${SITE_URL}/jobs`;
  } else if (reqPath === "/about") {
    title = `About the Newsroom & Editorial Standards · ${SITE_NAME}`;
    description = "Dubai Startups Daily covers the people and capital building Dubai's next companies. Read our sourcing principles, corrections policy, and meet the desk.";
    canonical = `${SITE_URL}/about`;
  } else if (reqPath.startsWith("/category/")) {
    const slug = reqPath.replace("/category/", "").replace(/\/$/, "");
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (cat) {
      title = `${cat.name} · ${SITE_NAME}`;
      description = cat.description;
      canonical = `${SITE_URL}/category/${cat.slug}`;
    }
  }

  // Clean up static template tags to prevent duplicates
  let html = htmlTemplate
    .replace(/<title>.*?<\/title>/i, `<title>${escapeXml(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, "")
    .replace(/<meta\s+property="og:[^"]*"\s+content=".*?"\s*\/?>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"\s+content=".*?"\s*\/?>/gi, "")
    .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, "");

  // Build clean meta tags injection
  const metaTags = `
    <link rel="canonical" href="${escapeXml(canonical)}" />
    <meta name="description" content="${escapeXml(description)}" />
    <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}" />
    <meta property="og:title" content="${escapeXml(title)}" />
    <meta property="og:description" content="${escapeXml(description)}" />
    <meta property="og:url" content="${escapeXml(canonical)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${escapeXml(SITE_NAME)}" />
    <meta property="og:image" content="${escapeXml(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeXml(title)}" />
    <meta name="twitter:description" content="${escapeXml(description)}" />
    <meta name="twitter:image" content="${escapeXml(ogImage)}" />
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
  `;

  html = html.replace("</head>", `${metaTags}\n</head>`);

  const gsc = process.env.VITE_GSC_VERIFICATION;
  if (gsc) {
    html = html.replace("</head>", `  <meta name="google-site-verification" content="${escapeXml(gsc)}" />\n</head>`);
  }

  if (noscriptContent) {
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n<noscript>${noscriptContent}</noscript>`);
  }

  return html;
}
