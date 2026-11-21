import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, Copy } from "lucide-react";
import { getArticle, getCategory, formatDate, initials, relatedArticles } from "@/data/articles";
import CategoryTag from "@/components/CategoryTag";
import { ArticleCardStandard, ArticleCardRow } from "@/components/ArticleCard";

const Block = ({ b, first }) => {
  if (b.t === "h") return <h2>{b.x}</h2>;
  if (b.t === "q")
    return (
      <blockquote className="my-10 border-l-4 border-gold pl-6 sm:pl-8">
        <p className="font-headline italic font-semibold text-2xl sm:text-[26px] leading-snug text-ink dark:text-white">“{b.x}”</p>
      </blockquote>
    );
  return <p className={first ? "dropcap" : ""}>{b.x}</p>;
};

const ArticlePage = () => {
  const { slug } = useParams();
  const article = getArticle(slug);
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center" data-testid="article-not-found">
        <h1 className="font-headline font-black text-4xl text-ink dark:text-white">Story not found</h1>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-gold">
          Back to the front page <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const cat = getCategory(article.category);
  const related = relatedArticles(article, 3);
  const moreFromCat = relatedArticles(article, 10)
    .filter((a) => a.category === article.category)
    .slice(0, 3);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(article.title);

  return (
    <div data-testid="article-page" className="bg-white dark:bg-navy-950 transition-colors duration-200">
      <article className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-slate-400" data-testid="article-breadcrumb">
          <Link to="/" className="hover:text-gold transition-colors duration-200">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${cat.slug}`} className="hover:text-gold transition-colors duration-200">{cat.name}</Link>
        </nav>

        {/* Head */}
        <header className="max-w-4xl mt-8 reveal d1">
          <CategoryTag slug={article.category} />
          <h1
            data-testid="article-title"
            className="font-headline font-black text-3xl sm:text-5xl leading-[1.08] mt-5 text-ink dark:text-white"
          >
            {article.title}
          </h1>
          <p className="mt-5 font-headline text-lg sm:text-xl leading-relaxed text-neutral-600 dark:text-slate-300" data-testid="article-dek">
            {article.dek}
          </p>

          {/* Byline */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 dark:border-white/10 py-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-ink dark:bg-navy-900 border dark:border-gold/30 text-gold flex items-center justify-center font-headline font-bold text-sm">
                {initials(article.author)}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-white" data-testid="article-author">
                  {article.author}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500 dark:text-slate-400">
                  {article.authorRole}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500 dark:text-slate-400">
              <span data-testid="article-date">{formatDate(article.date)}</span>
              <span className="inline-flex items-center gap-1" data-testid="article-readtime">
                <Clock size={11} strokeWidth={2.4} /> {article.readTime} min read
              </span>
            </div>
          </div>

          {/* Share */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={copyLink}
              data-testid="article-share-copy"
              className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-white/20 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink dark:text-slate-200 hover:border-gold hover:text-golddark dark:hover:text-gold transition-colors duration-200"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
              data-testid="article-share-x"
              className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-white/20 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink dark:text-slate-200 hover:border-gold hover:text-golddark dark:hover:text-gold transition-colors duration-200"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Share
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
              data-testid="article-share-linkedin"
              className="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-white/20 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink dark:text-slate-200 hover:border-gold hover:text-golddark dark:hover:text-gold transition-colors duration-200"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg> Post
            </a>
          </div>
        </header>

        {/* Hero image */}
        <figure className="mt-9 reveal d2">
          <div className="aspect-[21/9] img-zoom bg-mist dark:bg-navy-900 border border-transparent dark:border-white/5 max-h-[560px]">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
          {article.imageCaption && (
            <figcaption className="mt-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-slate-400">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* Body */}
        <div className="grid lg:grid-cols-12 gap-12 mt-12">
          <div className="lg:col-span-8 article-body reveal d3">
            {article.body.map((b, i) => (
              <Block key={i} b={b} first={i === 0} />
            ))}
          </div>
          <aside className="lg:col-span-4 space-y-10 reveal d4">
            {/* Author card */}
            <div className="border border-neutral-200 dark:border-white/10 p-6 bg-mist dark:bg-navy-900/60">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">About the author</span>
              <h3 className="font-headline font-bold text-xl mt-2 text-ink dark:text-white">{article.author}</h3>
              <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-slate-400 mt-1">
                {article.authorRole}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-slate-300">
                Reporting on early-stage founders, cross-border venture capital and deep technology investments
                across the United Arab Emirates.
              </p>
            </div>

            {/* In this section */}
            {!!moreFromCat.length && (
              <div className="border-t-[3px] border-ink dark:border-white/20 pt-4">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink dark:text-white">
                  More in {cat.name}
                </span>
                <div className="mt-4 divide-y divide-neutral-200 dark:divide-white/10">
                  {moreFromCat.map((a) => (
                    <div key={a.slug} className="py-3 first:pt-0 last:pb-0">
                      <ArticleCardRow article={a} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related */}
        {!!related.length && (
          <section className="mt-20 pt-12 border-t border-neutral-200 dark:border-white/10" data-testid="article-related">
            <div className="flex items-end justify-between gap-6 border-t-[3px] border-ink dark:border-white/20 pt-5">
              <h2 className="font-headline font-black text-3xl leading-none text-ink dark:text-white">Related reporting</h2>
              <Link
                to={`/category/${cat.slug}`}
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink dark:text-gold hover:text-gold transition-colors duration-200"
              >
                All {cat.short} →
              </Link>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((a) => (
                <ArticleCardStandard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default ArticlePage;
