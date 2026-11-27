import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/data/articles";
import CategoryTag from "./CategoryTag";

const shortDate = (iso) => formatDate(iso).replace(/ \d{4}$/, "");

export const Meta = ({ article, className = "", light = false, showDate = true }) => (
  <p className={`meta flex flex-wrap items-center gap-x-2 gap-y-1 ${light ? "!text-white/70" : ""} ${className}`}>
    <span className={`font-sans text-[0.78rem] font-medium ${light ? "text-white" : "text-ink"}`}>{article.author}</span>
    {showDate && (
      <>
        <span aria-hidden="true">·</span>
        <time dateTime={article.date}>{shortDate(article.date)}</time>
      </>
    )}
    <span aria-hidden="true">·</span>
    <span>{article.readTime} min read</span>
  </p>
);

/**
 * Image tile with the headline set on top of it.
 * The whole tile is one link (stretched), the category chip sits above it.
 */
export const StoryOverlay = ({ article, className = "", size = "lg", eager = false }) => (
  <article data-testid={`article-card-${article.slug}`} className={`group tile scrim ${className}`}>
    {article.image && (
      <img
        src={article.image}
        alt={article.imageAlt || article.imageCaption || article.title}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager && size === "lg" ? "high" : undefined}
        className="absolute inset-0"
      />
    )}
    <Link to={`/article/${article.slug}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[5]" />
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 ${size === "lg" ? "p-5 sm:p-8 lg:p-10" : "p-5 sm:p-6"}`}>
      <CategoryTag slug={article.category} variant="glass" className="pointer-events-auto" />
      <h2
        className={`mt-3 font-display font-bold text-white ${
          size === "lg"
            ? "text-[1.9rem] sm:text-[2.8rem] lg:text-[3.6rem] leading-[1] tracking-[-0.03em] max-w-[19ch]"
            : "text-[1.3rem] sm:text-[1.45rem] leading-[1.08] tracking-[-0.015em]"
        }`}
        style={{ fontVariationSettings: '"opsz" 40' }}
        data-testid="article-card-title"
      >
        <Link to={`/article/${article.slug}`} data-testid={`article-link-${article.slug}`} className="pointer-events-auto">
          <span className="title-link">{article.title}</span>
        </Link>
      </h2>
      {size === "lg" && (
        <p className="mt-4 hidden sm:block max-w-[52ch] text-[1rem] leading-relaxed text-white/75">{article.dek}</p>
      )}
      <Meta article={article} light className="mt-4" showDate={size === "lg"} />
    </div>
  </article>
);

/** Image on top, headline below. */
export const StoryCard = ({ article, className = "", aspect = "aspect-[4/3]", size = "md", showDek = false }) => (
  <article data-testid={`article-card-${article.slug}`} className={`group relative flex flex-col ${className}`}>
    <div className={`tile ${aspect}`}>
      {article.image && <img src={article.image} alt={article.imageAlt || article.imageCaption || article.title} loading="lazy" />}
    </div>
    <div className="pt-4 flex flex-1 flex-col">
      <CategoryTag slug={article.category} className="self-start" />
      <h3
        className={`mt-3 font-display font-bold tracking-[-0.03em] text-ink ${
          size === "lg" ? "text-[1.6rem] sm:text-[1.9rem] leading-[1.02]" : "text-[1.2rem] leading-[1.12]"
        }`}
      >
        <Link to={`/article/${article.slug}`} className="after:absolute after:inset-0">
          <span className="title-link">{article.title}</span>
        </Link>
      </h3>
      {showDek && <p className="mt-2.5 text-[0.93rem] leading-relaxed text-muted line-clamp-3">{article.dek}</p>}
      <Meta article={article} className="mt-auto pt-4" showDate={false} />
    </div>
  </article>
);

/** Big-type list row; thumbnail shows on wide screens. */
export const StoryRow = ({ article, index }) => (
  <article
    data-testid={`article-card-${article.slug}`}
    className="group relative grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr_auto] lg:grid-cols-[3.5rem_1fr_11rem_7rem] items-center gap-x-4 gap-y-2 border-b hairline py-5 sm:py-6 transition-colors duration-300 hover:bg-ink/[0.03]"
  >
    <span className="meta self-start pt-1.5 text-[0.8rem]">{String(index).padStart(2, "0")}</span>
    <div className="min-w-0">
      <h3 className="font-display text-[1.25rem] sm:text-[1.6rem] lg:text-[1.85rem] font-bold leading-[1.06] tracking-[-0.03em] text-ink">
        <Link to={`/article/${article.slug}`} className="after:absolute after:inset-0">
          <span className="title-link">{article.title}</span>
        </Link>
      </h3>
      <div className="mt-2.5 flex flex-wrap items-center gap-3 lg:hidden">
        <CategoryTag slug={article.category} />
        <span className="meta">{shortDate(article.date)}</span>
      </div>
    </div>
    <div className="hidden lg:flex flex-col items-start gap-2">
      <CategoryTag slug={article.category} />
      <span className="meta">{shortDate(article.date)} · {article.readTime} min</span>
    </div>
    <div className="hidden sm:block tile aspect-[4/3] w-28 lg:w-full !rounded-card">
      <img src={article.image} alt="" loading="lazy" />
    </div>
  </article>
);

/** Compact thumbnail + headline. */
export const StoryMini = ({ article }) => (
  <article data-testid={`article-card-${article.slug}`} className="group relative grid grid-cols-[5.5rem_1fr] gap-4 items-center">
    <div className="tile aspect-square !rounded-card">
      <img src={article.image} alt="" loading="lazy" />
    </div>
    <div className="min-w-0">
      <CategoryTag slug={article.category} />
      <h3 className="mt-2 font-display text-[1.05rem] font-bold leading-[1.12] tracking-[-0.025em] text-ink line-clamp-3">
        <Link to={`/article/${article.slug}`} className="after:absolute after:inset-0">
          <span className="title-link">{article.title}</span>
        </Link>
      </h3>
    </div>
  </article>
);

export const MoreLink = ({ to, children, testid }) => (
  <Link
    to={to}
    data-testid={testid}
    className="group inline-flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-3.5 pr-2.5 text-[0.85rem] font-semibold text-ink ring-1 ring-line/15 hover:bg-lime hover:text-onlime hover:ring-transparent transition-colors"
  >
    {children}
    <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </Link>
);
