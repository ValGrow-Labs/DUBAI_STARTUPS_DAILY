/**
 * Dubai Startups Daily (DSD) SEO Metadata & Structured Data Generator
 */

export const SITE_NAME = "Dubai Startups Daily";
export const SITE_ABBR = "DSD";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://dubaistartupsdaily.ae").replace(/\/$/, "");
export const TWITTER_HANDLE = "@DubaiDaily";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.svg`;

export const DEFAULT_SEO = {
  title: "Dubai Startups Daily · The Daily Pulse of Dubai’s Startup Ecosystem",
  description:
    "The Daily Pulse of Dubai’s Startup Ecosystem. Breaking news on seed-to-growth funding rounds, AI, venture capital, business setup, tech events, and startup jobs in Dubai.",
  canonical: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  type: "website",
};

/**
 * Builds absolute canonical URL from path
 */
export function buildCanonical(path = "/") {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Schema: Organization (Dubai Startups Daily)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    alternateName: SITE_ABBR,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.svg`,
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

/**
 * Schema: WebSite with Sitelinks SearchBox
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_SEO.description,
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

/**
 * Schema: NewsArticle for articles/stories
 */
export function getNewsArticleSchema(article, pageUrl) {
  if (!article) return null;

  const imageUrl = article.image
    ? article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image.startsWith("/") ? "" : "/"}${article.image}`
    : DEFAULT_OG_IMAGE;

  const datePub = article.date ? `${article.date}T07:00:00+04:00` : new Date().toISOString();
  const dateMod = article.updatedAt || article.modifiedDate || datePub;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl || buildCanonical(`/article/${article.slug}`),
    },
    headline: article.seoTitle || article.title,
    description: article.metaDescription || article.dek,
    image: [imageUrl],
    datePublished: datePub,
    dateModified: dateMod,
    author: {
      "@type": "Person",
      name: article.author || "Editorial Desk",
      jobTitle: article.authorRole || "Journalist",
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    keywords: [
      ...(article.focusKeyword ? [article.focusKeyword] : []),
      ...(article.secondaryKeywords || []),
      ...(article.tags || []),
      article.category,
      "Dubai Startups",
    ].filter(Boolean).join(", "),
    articleSection: article.category,
    inLanguage: "en-US",
  };
}

/**
 * Schema: BreadcrumbList
 */
export function getBreadcrumbSchema(items = []) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: buildCanonical(item.path),
    })),
  };
}

/**
 * Schema: CollectionPage for categories
 */
export function getCollectionSchema(category, pageUrl, articles = []) {
  if (!category) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} · Dubai Startups Daily`,
    description: category.description,
    url: pageUrl || buildCanonical(`/category/${category.slug}`),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasPart: articles.slice(0, 10).map((a) => ({
      "@type": "NewsArticle",
      headline: a.title,
      url: buildCanonical(`/article/${a.slug}`),
      datePublished: a.date ? `${a.date}T07:00:00+04:00` : undefined,
    })),
  };
}

/**
 * Schema: Event for individual curated events
 */
export function getEventSchema(evt, pageUrl) {
  if (!evt) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evt.title,
    description: evt.description || evt.tagline,
    startDate: "2026-12-11T08:30:00+04:00", // Standard ISO fallback
    endDate: "2026-12-12T17:30:00+04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: evt.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    organizer: {
      "@type": "Organization",
      name: evt.organizer || SITE_NAME,
      url: pageUrl || buildCanonical("/events"),
    },
    offers: {
      "@type": "Offer",
      price: evt.price.includes("Free") ? "0" : evt.price.replace(/[^0-9]/g, "") || "0",
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      url: pageUrl || buildCanonical("/events"),
    },
  };
}

/**
 * Schema: JobPosting for active vacancies
 */
export function getJobPostingSchema(job, _pageUrl) {
  if (!job) return null;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.summary} Requirements: ${(job.requirements || []).join(". ")}`,
    datePosted: "2026-11-20T08:00:00+04:00",
    validThrough: "2027-02-28T23:59:59+04:00",
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: SITE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "AED",
      value: {
        "@type": "QuantitativeValue",
        unitText: "MONTH",
      },
    },
  };
}
