/** Site sections. Shared by the site and the CMS server (no imports here). */
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

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
