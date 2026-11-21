import { ARTICLES_A } from "./stories-a";
import { ARTICLES_B } from "./stories-b";
import { CATEGORIES } from "./categories.js";

export { CATEGORIES };

/** Bundled stories: used until the CMS responds, and as an offline fallback. */
export const SEED_ARTICLES = [...ARTICLES_A, ...ARTICLES_B];

// Live list. `let` export = live binding, so importers always see the latest set.
export let ARTICLES = SEED_ARTICLES;

export const setArticles = (list) => {
  if (Array.isArray(list) && list.length) ARTICLES = list;
};

export const byDateDesc = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug);

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);

export const byCategory = (slug) =>
  ARTICLES.filter((a) => a.category === slug).sort(byDateDesc);

export const featuredArticle = () => ARTICLES.find((a) => a.featured) || [...ARTICLES].sort(byDateDesc)[0];

export const latestArticles = (n) => [...ARTICLES].sort(byDateDesc).slice(0, n);

export const trendingArticles = (n) => {
  const t = ARTICLES.filter((a) => a.trending).sort(byDateDesc);
  const fill = [...ARTICLES].sort(byDateDesc).filter((a) => !t.includes(a));
  return [...t, ...fill].slice(0, n);
};

export const relatedArticles = (article, n = 3) => {
  const sameCat = byCategory(article.category).filter((a) => a.slug !== article.slug);
  const fill = latestArticles(20).filter(
    (a) => a.category !== article.category && a.slug !== article.slug
  );
  return [...sameCat, ...fill].slice(0, n);
};

export const searchArticles = (q) => {
  const query = (q || "").trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
  return ARTICLES.filter((a) => {
    const cat = getCategory(a.category)?.name || "";
    const hay = [a.title, a.dek, cat, a.author, ...(a.tags || [])].join(" ").toLowerCase();
    // match at word starts so "ai" finds "AI" but not "Dubai"
    return terms.every((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(hay));
  }).sort(byDateDesc);
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const formatDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Headline figures pulled from our own reporting, each linked to its story. */
export const FIGURES = [
  { value: "$620M", label: "Raised by Dubai startups in Q2, a record", slug: "chart-week-dubai-620m-venture-quarter" },
  { value: "$140M", label: "Dirham Pay exit to Bahrain’s Lema", slug: "dirham-pay-lema-acquisition" },
  { value: "$75M", label: "Cedar Capital’s debut pre-seed fund", slug: "cedar-capital-75m-debut-fund" },
  { value: "$28M", label: "Qudra Logistics Series B", slug: "qudra-logistics-28m-series-b" },
  { value: "4.2%", label: "Dubai non-oil growth in Q1", slug: "dubai-non-oil-growth-q1" },
  { value: "AED 90bn", label: "Off-plan property sales in May", slug: "dubai-property-90-billion-may" },
  { value: "50+", label: "AI firms resident at Dubai AI Campus", slug: "dubai-ai-campus-50-firms" },
  { value: "12", label: "Fintechs admitted to the digital dirham sandbox", slug: "digital-dirham-difc-sandbox-fintechs" },
];
