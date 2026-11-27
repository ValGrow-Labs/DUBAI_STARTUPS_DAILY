// Server-side SEO generator: XML sitemaps + HTML meta, status codes & Schema.org injection.
import { CATEGORIES } from "../src/data/categories.js";
import { ARTICLES_A } from "../src/data/stories-a.js";
import { ARTICLES_B } from "../src/data/stories-b.js";

const SITE_NAME = "Dubai Startups Daily";
const DEFAULT_SITE_URL = "https://dubai-startups-daily.vercel.app";
const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;
const PUBLISHER_LOGO_URL = `${SITE_URL}/logo.png`;

/**
 * Returns bundled local articles sorted newest-first.
 */
export function getLocalArticlesForSitemap() {
  return [...ARTICLES_A, ...ARTICLES_B].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getLocalArticleBySlug(slug) {
  return getLocalArticlesForSitemap().find((a) => a.slug === slug) || null;
}

const escapeXml = (unsafe = "") =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toIsoDate = (raw, fallback) => {
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return fallback;
};

const resolveAbsoluteUrl = (rawUrl, fallback = DEFAULT_OG_IMAGE) => {
  if (!rawUrl || typeof rawUrl !== "string") return fallback;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  return `${SITE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
};

/**
 * Generate complete XML Sitemap including all public pages, categories, and published articles
 */
export function generateSitemapXml(articles = [], siteUrl = SITE_URL) {
  const baseUrl = (siteUrl || SITE_URL).replace(/\/$/, "");
  const now = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { loc: `${baseUrl}/`, changefreq: "hourly", priority: "1.0", lastmod: now },
    { loc: `${baseUrl}/setup`, changefreq: "weekly", priority: "0.9", lastmod: now },
    { loc: `${baseUrl}/events`, changefreq: "daily", priority: "0.9", lastmod: now },
    { loc: `${baseUrl}/jobs`, changefreq: "daily", priority: "0.9", lastmod: now },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.6", lastmod: now },
  ];

  const categoryRoutes = CATEGORIES.map((c) => ({
    loc: `${baseUrl}/category/${encodeURIComponent(c.slug)}`,
    changefreq: "daily",
    priority: "0.8",
    lastmod: now,
  }));

  const articleRoutes = (articles || [])
    .filter((a) => a && a.slug && (!a.status || a.status === "published"))
    .map((a) => ({
      loc: `${baseUrl}/article/${encodeURIComponent(a.slug.trim())}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: toIsoDate(a.updated_at || a.updatedAt || a.published_at || a.date || a.created_at, now),
    }));

  const seen = new Set();
  const allUrls = [...staticRoutes, ...categoryRoutes, ...articleRoutes].filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

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
 * Generate Google News XML Sitemap (only if explicitly invoked)
 */
export function generateNewsSitemapXml(articles = []) {
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
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

function getOrgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    alternateName: "DSD",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: PUBLISHER_LOGO_URL,
      width: 512,
      height: 512,
    },
    publishingPrinciples: `${SITE_URL}/about`,
    correctionsPolicy: `${SITE_URL}/about`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      addressCountry: "AE",
    },
    sameAs: [
      "https://twitter.com/DubaiDaily",
      "https://linkedin.com/company/dubai-startups-daily",
    ],
  };
}

function getWebSiteSchema(description) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

function getBreadcrumbSchema(items = []) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

function normalizePath(rawPath = "/") {
  const pathOnly = String(rawPath || "/").split("?")[0].split("#")[0] || "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) return pathOnly.slice(0, -1);
  return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
}

/**
 * Resolves route SEO metadata, HTTP status code, and injects clean head tags into HTML template.
 * Returns { status, html }.
 */
export function renderRouteHtml(htmlTemplate, reqPath, { getArticle = getLocalArticleBySlug, getArticles = getLocalArticlesForSitemap } = {}) {
  const cleanPath = normalizePath(reqPath);
  const defaultDesc =
    "The Daily Pulse of Dubai’s Startup Ecosystem. Breaking news on seed-to-growth funding rounds, AI, venture capital, business setup, tech events, and startup jobs in Dubai.";

  let status = 200;
  let title = "Dubai Startups Daily · The Daily Pulse of Dubai’s Startup Ecosystem";
  let description = defaultDesc;
  let canonical = `${SITE_URL}/`;
  let ogType = "website";
  let ogImage = DEFAULT_OG_IMAGE;
  let robots = "index, follow";
  let extraOg = "";
  let jsonLd = null;
  let noscriptContent = "";

  if (cleanPath === "/") {
    jsonLd = [getOrgSchema(), getWebSiteSchema(defaultDesc)];
  } else if (cleanPath.startsWith("/article/")) {
    const slug = decodeURIComponent(cleanPath.slice("/article/".length).split("/")[0] || "");
    const article = slug ? getArticle(slug) : null;
    if (!article || (article.status && article.status !== "published")) {
      status = 404;
      title = `Story Not Found · ${SITE_NAME}`;
      description = "The story you requested could not be found on Dubai Startups Daily.";
      canonical = null;
      robots = "noindex, nofollow";
    } else {
      const cat = CATEGORIES.find((c) => c.slug === article.category);
      title = `${article.seoTitle || article.title} · ${SITE_NAME}`;
      description = article.metaDescription || article.dek || defaultDesc;
      canonical = article.canonicalUrl || `${SITE_URL}/article/${encodeURIComponent(article.slug)}`;
      ogType = "article";
      ogImage = resolveAbsoluteUrl(article.ogImage || article.image);
      const publishedIso = article.publishedAt || (article.date ? `${article.date}T07:00:00+04:00` : new Date().toISOString());
      const modifiedIso = article.updatedAt || article.modifiedDate || publishedIso;
      const authorName = article.author || SITE_NAME;
      const isOrgAuthor = authorName === SITE_NAME;

      extraOg = [
        `<meta property="article:published_time" content="${escapeXml(publishedIso)}" />`,
        `<meta property="article:modified_time" content="${escapeXml(modifiedIso)}" />`,
        `<meta property="article:author" content="${escapeXml(authorName)}" />`,
        cat ? `<meta property="article:section" content="${escapeXml(cat.name)}" />` : "",
      ]
        .filter(Boolean)
        .join("\n    ");

      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
        headline: article.seoTitle || article.title,
        description,
        image: [ogImage],
        datePublished: publishedIso,
        dateModified: modifiedIso,
        author: isOrgAuthor
          ? { "@type": "Organization", name: SITE_NAME, url: SITE_URL }
          : {
              "@type": "Person",
              name: authorName,
              jobTitle: article.authorRole || "Journalist",
              worksFor: { "@type": "Organization", name: SITE_NAME },
            },
        publisher: {
          "@type": "NewsMediaOrganization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: PUBLISHER_LOGO_URL,
            width: 512,
            height: 512,
          },
        },
        articleSection: article.category,
        inLanguage: "en-US",
      };

      const crumbs = [
        { name: "Home", path: "/" },
        ...(cat ? [{ name: cat.name, path: `/category/${cat.slug}` }] : []),
        { name: article.title, path: `/article/${article.slug}` },
      ];

      jsonLd = [articleSchema, getBreadcrumbSchema(crumbs)].filter(Boolean);

      noscriptContent = `<article style="max-width:800px;margin:2rem auto;padding:1rem;">
      <h1>${escapeXml(article.title)}</h1>
      <p style="font-size:1.2rem;color:#666;">${escapeXml(article.dek || "")}</p>
      <p><small>By ${escapeXml(authorName)} · ${escapeXml(article.date || "")}</small></p>
      <div>${(article.blocks || [])
        .map((b) => (b.t === "h" ? `<h2>${escapeXml(b.x)}</h2>` : `<p>${escapeXml(b.x)}</p>`))
        .join("")}</div>
    </article>`;
    }
  } else if (cleanPath.startsWith("/category/")) {
    const slug = cleanPath.slice("/category/".length);
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (!cat) {
      status = 404;
      title = `Section Not Found · ${SITE_NAME}`;
      description = "The requested section does not exist on Dubai Startups Daily.";
      canonical = null;
      robots = "noindex, nofollow";
    } else {
      title = `${cat.name} News & Stories · ${SITE_NAME}`;
      description = cat.description;
      canonical = `${SITE_URL}/category/${cat.slug}`;
      const catArticles = (getArticles() || []).filter((a) => a.category === cat.slug);
      jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.name} · ${SITE_NAME}`,
          description: cat.description,
          url: canonical,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          hasPart: catArticles.slice(0, 10).map((a) => ({
            "@type": "NewsArticle",
            headline: a.title,
            url: `${SITE_URL}/article/${a.slug}`,
            datePublished: a.date ? `${a.date}T07:00:00+04:00` : undefined,
          })),
        },
        getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: cat.name, path: `/category/${cat.slug}` },
        ]),
      ];
    }
  } else if (cleanPath === "/setup" || cleanPath === "/guides") {
    title = `Dubai Business Setup & Startup Playbooks · ${SITE_NAME}`;
    description =
      "Comprehensive guides for launching a startup in Dubai: DIFC vs. DMCC vs. Mainland, corporate banking with Wio, and the 10-Year UAE Golden Visa.";
    canonical = `${SITE_URL}/setup`;
    jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "How to Launch, License and Scale a Startup in Dubai",
        description,
        url: canonical,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: PUBLISHER_LOGO_URL, width: 512, height: 512 },
        },
      },
      getBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Business Setup & Guides", path: "/setup" },
      ]),
    ];
  } else if (cleanPath === "/events") {
    title = `Dubai Startup & Tech Events Calendar · ${SITE_NAME}`;
    description =
      "Curated calendar of venture pitch nights, angel circles, demo days, and tech summits across Dubai, DIFC, and Internet City.";
    canonical = `${SITE_URL}/events`;
    jsonLd = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Startup Events", path: "/events" },
    ]);
  } else if (cleanPath === "/jobs") {
    title = `Dubai Startup Jobs Board · ${SITE_NAME}`;
    description =
      "Verified engineering, product, marketing, and operations roles at seed-to-Series B Dubai startups with transparent monthly salaries in AED.";
    canonical = `${SITE_URL}/jobs`;
    jsonLd = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Startup Jobs", path: "/jobs" },
    ]);
  } else if (cleanPath === "/about") {
    title = `About the Newsroom & Editorial Standards · ${SITE_NAME}`;
    description =
      "We cover the people and money building Dubai's next companies. Read our sourcing principles, corrections policy, and editorial ethics.";
    canonical = `${SITE_URL}/about`;
    jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: `About ${SITE_NAME}`,
        description,
        url: canonical,
        mainEntity: getOrgSchema(),
      },
      getBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About the Newsroom", path: "/about" },
      ]),
    ];
  } else if (cleanPath === "/search") {
    title = `Search the Archive · ${SITE_NAME}`;
    description = "Search past Dubai startup stories, funding rounds, founder interviews, and venture capital reports.";
    canonical = `${SITE_URL}/search`;
    robots = "noindex, follow";
  } else if (cleanPath === "/admin" || cleanPath.startsWith("/admin/")) {
    title = `CMS · ${SITE_NAME}`;
    description = "Dubai Startups Daily Content Management System.";
    canonical = null;
    robots = "noindex, follow";
  } else {
    status = 404;
    title = `Page Not Found · ${SITE_NAME}`;
    description = "The page you requested could not be found on Dubai Startups Daily.";
    canonical = null;
    robots = "noindex, nofollow";
  }

  // Strip all replaceable SEO tags to guarantee zero duplicates
  let html = htmlTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeXml(title)}</title>`)
    .replace(/<meta[^>]+name=["'](?:description|robots|twitter:[^"']+)["'][^>]*>\s*/gi, "")
    .replace(/<meta[^>]+property=["'](?:og:[^"']+|article:[^"']+)["'][^>]*>\s*/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, "");

  const metaTags = [
    canonical ? `<link rel="canonical" href="${escapeXml(canonical)}" />` : "",
    `<meta name="description" content="${escapeXml(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:title" content="${escapeXml(title)}" />`,
    `<meta property="og:description" content="${escapeXml(description)}" />`,
    canonical ? `<meta property="og:url" content="${escapeXml(canonical)}" />` : "",
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${escapeXml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:image" content="${escapeXml(ogImage)}" />`,
    extraOg,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeXml(title)}" />`,
    `<meta name="twitter:description" content="${escapeXml(description)}" />`,
    `<meta name="twitter:image" content="${escapeXml(ogImage)}" />`,
    jsonLd ? `<script id="seo-schema-ld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  html = html.replace("</head>", `    ${metaTags}\n  </head>`);

  if (noscriptContent) {
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    <noscript>${noscriptContent}</noscript>`);
  }

  return { status, html };
}

/**
 * Backwards-compatible wrapper returning HTML string directly.
 */
export function injectPrerenderedHtml(htmlTemplate, reqPath, article = null) {
  return renderRouteHtml(htmlTemplate, reqPath, {
    getArticle: () => article,
    getArticles: getLocalArticlesForSitemap,
  }).html;
}
