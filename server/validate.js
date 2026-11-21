import { CATEGORY_SLUGS } from "../src/data/categories.js";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE = /^(https:\/\/\S+|\/uploads\/[\w.-]+)$/;
const BLOCK_TYPES = new Set(["p", "h", "q"]);

const str = (v) => (typeof v === "string" ? v.trim() : "");

/** Returns { value, errors } where errors maps field -> message. */
export function validateArticle(input = {}) {
  const errors = {};
  const v = {
    slug: str(input.slug).toLowerCase(),
    title: str(input.title),
    dek: str(input.dek),
    category: str(input.category),
    author: str(input.author),
    authorRole: str(input.authorRole),
    date: str(input.date),
    readTime: Number(input.readTime),
    image: str(input.image),
    imageCaption: str(input.imageCaption),
    tags: Array.isArray(input.tags) ? input.tags.map(str).filter(Boolean).slice(0, 12) : [],
    featured: Boolean(input.featured),
    trending: Boolean(input.trending),
    blocks: Array.isArray(input.blocks)
      ? input.blocks
          .map((b) => ({ t: BLOCK_TYPES.has(b?.t) ? b.t : "p", x: str(b?.x) }))
          .filter((b) => b.x)
      : [],
  };

  if (!v.title) errors.title = "Add a headline.";
  else if (v.title.length > 180) errors.title = "Keep the headline under 180 characters.";
  if (!v.slug) errors.slug = "Add a URL slug.";
  else if (!SLUG.test(v.slug)) errors.slug = "Use lowercase letters, numbers and single hyphens only.";
  if (!v.dek) errors.dek = "Add a one- or two-sentence summary.";
  else if (v.dek.length > 400) errors.dek = "Keep the summary under 400 characters.";
  if (!CATEGORY_SLUGS.includes(v.category)) errors.category = "Pick a section.";
  if (!v.author) errors.author = "Add the author’s name.";
  if (!v.authorRole) errors.authorRole = "Add the author’s role.";
  if (!DATE.test(v.date) || Number.isNaN(Date.parse(v.date))) errors.date = "Use a valid date.";
  if (!Number.isInteger(v.readTime) || v.readTime < 1 || v.readTime > 60) errors.readTime = "Between 1 and 60 minutes.";
  if (!IMAGE.test(v.image)) errors.image = "Upload an image or paste an https:// image URL.";
  if (!v.blocks.length) errors.blocks = "Write at least one paragraph.";

  return { value: v, errors };
}
