import { ARTICLES_A } from "./stories-a";
import { ARTICLES_B } from "./stories-b";

export const CATEGORIES = [
  {
    slug: "startup-news",
    name: "Startup News",
    short: "Startups",
    accent: "gold",
    description: "New companies, launches and innovations from across Dubai's ecosystem.",
  },
  {
    slug: "funding-investment",
    name: "Funding & Investment",
    short: "Funding",
    accent: "gold",
    description: "Funding rounds, venture capital and acquisitions across the UAE and the Gulf.",
  },
  {
    slug: "business-news",
    name: "Business News",
    short: "Business",
    accent: "ink",
    description: "UAE companies, the economy and the markets that move the Gulf.",
  },
  {
    slug: "technology-ai",
    name: "Technology & AI",
    short: "Tech & AI",
    accent: "tech",
    description: "Artificial intelligence, fintech and emerging technologies, covered from Dubai.",
  },
  {
    slug: "founder-stories",
    name: "Founder Stories",
    short: "Founders",
    accent: "gold",
    dark: true,
    description: "Interviews and success stories from the people building in Dubai.",
  },
  {
    slug: "insights-analysis",
    name: "Insights & Analysis",
    short: "Insights",
    accent: "ink",
    description: "Market trends, research and data-led business insight from our newsroom.",
  },
];

export const ARTICLES = [...ARTICLES_A, ...ARTICLES_B];

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
    return terms.every((t) => hay.includes(t));
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
