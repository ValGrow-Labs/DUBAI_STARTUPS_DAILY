import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { getCategory, formatDate } from "@/data/articles";
import CategoryTag from "./CategoryTag";

const Meta = ({ article, light = false }) => (
  <div className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider ${light ? "text-white/60" : "text-neutral-500 dark:text-slate-400"}`}>
    <span>{article.author}</span>
    <span aria-hidden="true">·</span>
    <span>{formatDate(article.date)}</span>
    <span aria-hidden="true">·</span>
    <span className="inline-flex items-center gap-1">
      <Clock size={11} strokeWidth={2.4} /> {article.readTime} min
    </span>
  </div>
);

export const ArticleCardLead = ({ article, className = "", light = false }) => (
  <article data-testid={`article-card-${article.slug}`} className={`group ${className}`}>
    <Link to={`/article/${article.slug}`} className="block img-zoom" data-testid={`article-link-${article.slug}`}>
      <div className="aspect-[16/9] img-zoom bg-mist dark:bg-navy-900 border border-transparent dark:border-white/5">
        <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
      </div>
    </Link>
    <div className="pt-5">
      <CategoryTag slug={article.category} />
      <Link to={`/article/${article.slug}`}>
        <h2 className={`font-headline font-bold text-3xl sm:text-4xl leading-[1.12] mt-3 ${light ? "text-white" : "text-ink dark:text-white"} group-hover:text-gold transition-colors duration-300`} data-testid="article-card-title">
          {article.title}
        </h2>
      </Link>
      <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-white/70" : "text-neutral-600 dark:text-slate-300"}`}>{article.dek}</p>
      <div className="mt-4">
        <Meta article={article} light={light} />
      </div>
    </div>
  </article>
);

export const ArticleCardStandard = ({ article, className = "" }) => (
  <article data-testid={`article-card-${article.slug}`} className={`group flex flex-col ${className}`}>
    <Link to={`/article/${article.slug}`} className="block">
      <div className="aspect-[16/10] img-zoom bg-mist dark:bg-navy-900 border border-transparent dark:border-white/5">
        <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
      </div>
    </Link>
    <div className="pt-4 flex-1 flex flex-col">
      <CategoryTag slug={article.category} className="self-start" />
      <Link to={`/article/${article.slug}`} className="mt-2.5">
        <h3 className="font-headline font-bold text-xl leading-snug text-ink dark:text-white group-hover:text-gold transition-colors duration-300">
          {article.title}
        </h3>
      </Link>
      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-white/10">
        <Meta article={article} />
      </div>
    </div>
  </article>
);

export const ArticleCardRow = ({ article, light = false }) => (
  <article data-testid={`article-card-${article.slug}`} className="group flex gap-4 sm:gap-6 py-2">
    <Link to={`/article/${article.slug}`} className="w-28 sm:w-36 aspect-[4/3] shrink-0 block img-zoom" data-testid={`article-link-${article.slug}`}>
      <div className="w-full h-full bg-mist dark:bg-navy-900">
        <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
      </div>
    </Link>
    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
      <div>
        <CategoryTag slug={article.category} className="mb-1.5" />
        <Link to={`/article/${article.slug}`}>
          <h3 className={`font-headline font-bold text-base sm:text-lg leading-snug ${light ? "text-white" : "text-ink dark:text-white"} group-hover:text-gold transition-colors duration-300 line-clamp-2`} data-testid="article-card-title">
            {article.title}
          </h3>
        </Link>
      </div>
      <div className="mt-2">
        <Meta article={article} light={light} />
      </div>
    </div>
  </article>
);
