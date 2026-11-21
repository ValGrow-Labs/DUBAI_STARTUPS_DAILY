// Tiny JSON-file article store. Writes are atomic (temp file + rename).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLES_A } from "../src/data/stories-a.js";
import { ARTICLES_B } from "../src/data/stories-b.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DSD_DATA_DIR || path.join(here, "data");
const FILE = path.join(DATA_DIR, "content.json");

let cache = null;

const now = () => new Date().toISOString();

function load() {
  if (cache) return cache;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    const seed = [...ARTICLES_A, ...ARTICLES_B].map((a) => ({ ...a, updatedAt: now() }));
    cache = { articles: seed };
    save();
    console.log(`[store] seeded ${seed.length} stories into ${FILE}`);
  } else {
    cache = JSON.parse(fs.readFileSync(FILE, "utf8"));
  }
  return cache;
}

function save() {
  const tmp = `${FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
  fs.renameSync(tmp, FILE);
}

export const list = () => [...load().articles].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const get = (slug) => load().articles.find((a) => a.slug === slug) || null;

export function create(article) {
  const db = load();
  if (db.articles.some((a) => a.slug === article.slug)) {
    const err = new Error(`A story with the slug “${article.slug}” already exists.`);
    err.status = 409;
    err.field = "slug";
    throw err;
  }
  const record = { ...article, updatedAt: now() };
  if (record.featured) db.articles.forEach((a) => (a.featured = false));
  db.articles.push(record);
  save();
  return record;
}

export function update(slug, article) {
  const db = load();
  const idx = db.articles.findIndex((a) => a.slug === slug);
  if (idx === -1) return null;
  if (article.slug !== slug && db.articles.some((a) => a.slug === article.slug)) {
    const err = new Error(`A story with the slug “${article.slug}” already exists.`);
    err.status = 409;
    err.field = "slug";
    throw err;
  }
  const record = { ...article, updatedAt: now() };
  if (record.featured) db.articles.forEach((a) => (a.featured = false));
  db.articles[idx] = record;
  save();
  return record;
}

export function remove(slug) {
  const db = load();
  const before = db.articles.length;
  db.articles = db.articles.filter((a) => a.slug !== slug);
  if (db.articles.length === before) return false;
  save();
  return true;
}
