import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  DEFAULT_SEO,
  buildCanonical,
} from "@/lib/seo";

/**
 * Helper to get or create a <meta> element by attribute name/property
 */
function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Helper to get or create a <link> element by rel
 */
function setLinkTag(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Reusable SEO component for dynamic head metadata & JSON-LD
 */
const SEO = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
  author,
  section,
  keywords,
  schema,
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Page Title
    const finalTitle = title
      ? title.includes(SITE_NAME)
        ? title
        : `${title} · ${SITE_NAME}`
      : DEFAULT_SEO.title;
    document.title = finalTitle;

    // 2. Canonical URL
    const canonicalUrl = canonical || buildCanonical(pathname);
    setLinkTag("canonical", canonicalUrl);

    // 3. Meta Description
    const finalDesc = description || DEFAULT_SEO.description;
    setMetaTag("name", "description", finalDesc);

    // 4. Robots
    const robotsContent = `${noindex ? "noindex" : "index"}, ${
      nofollow ? "nofollow" : "follow"
    }`;
    setMetaTag("name", "robots", robotsContent);

    // 5. Open Graph tags
    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("property", "og:description", finalDesc);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:locale", "en_US");
    const ogImg = image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
      : DEFAULT_SEO.image;
    setMetaTag("property", "og:image", ogImg);

    if (type === "article") {
      if (publishedTime) setMetaTag("property", "article:published_time", publishedTime);
      if (modifiedTime) setMetaTag("property", "article:modified_time", modifiedTime);
      if (author) setMetaTag("property", "article:author", author);
      if (section) setMetaTag("property", "article:section", section);
    }

    // 6. Twitter Card tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", finalTitle);
    setMetaTag("name", "twitter:description", finalDesc);
    setMetaTag("name", "twitter:image", ogImg);
    setMetaTag("name", "twitter:site", TWITTER_HANDLE);

    // 7. Keywords
    if (keywords) {
      const kw = Array.isArray(keywords) ? keywords.join(", ") : keywords;
      setMetaTag("name", "keywords", kw);
    }

    // 8. JSON-LD Structured Data
    if (schema) {
      let script = document.getElementById("seo-schema-ld");
      if (!script) {
        script = document.createElement("script");
        script.id = "seo-schema-ld";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    }

    // Cleanup when component unmounts
    return () => {
      const script = document.getElementById("seo-schema-ld");
      if (script) script.remove();
    };
  }, [
    title,
    description,
    canonical,
    image,
    type,
    noindex,
    nofollow,
    publishedTime,
    modifiedTime,
    author,
    section,
    keywords,
    schema,
    pathname,
  ]);

  return null;
};

export default SEO;
