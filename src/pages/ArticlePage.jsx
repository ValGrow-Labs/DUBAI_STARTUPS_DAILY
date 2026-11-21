import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Link2 } from "lucide-react";
import { getArticle, getCategory, formatDate, initials, relatedArticles } from "@/data/articles";
import CategoryTag from "@/components/CategoryTag";
import { StoryCard } from "@/components/ArticleCard";
import SectionHead from "@/components/SectionHead";
import Briefing from "@/components/Briefing";
import Reveal from "@/components/Reveal";

const Block = ({ b, first }) => {
  if (b.t === "h") return <h2>{b.x}</h2>;
  if (b.t === "q")
    return (
      <figure className="my-12 -mx-1 sm:-mx-8 rounded-tile bg-surface p-7 sm:p-10 ring-1 ring-line/10">
        <span aria-hidden="true" className="block font-display text-[4rem] leading-[0.5] text-acc">“</span>
        <blockquote
          className="mt-4 font-display text-[1.55rem] sm:text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink"
          style={{ fontVariationSettings: '"opsz" 36' }}
        >
          {b.x}
        </blockquote>
      </figure>
    );
  return <p className={first ? "lede" : ""}>{b.x}</p>;
};

const ReadingProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-overlay h-[3px]">
      <div className="h-full origin-left bg-lime" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
};

const shareCls =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.82rem] font-semibold text-ink ring-1 ring-line/15 hover:bg-ink hover:text-bg hover:ring-transparent transition-colors duration-200";

const ArticlePage = () => {
  const { slug } = useParams();
  const article = getArticle(slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = article ? `${article.title} · Dubai Startups Daily` : "Story not found · Dubai Startups Daily";
    return () => {
      document.title = "Dubai Startups Daily";
    };
  }, [article]);

  if (!article) {
    return (
      <div className="wrap py-28" data-testid="article-not-found">
        <p className="eyebrow">Not found</p>
        <h1 className="display mt-3 text-[2.8rem] sm:text-[4rem] leading-[0.95] max-w-[16ch]">We couldn’t find that story.</h1>
        <p className="mt-4 text-muted">It may have moved, or the link may be incomplete.</p>
        <Link to="/" className="btn-lime mt-8">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  const cat = getCategory(article.category);
  const blocks = article.blocks || article.body || [];
  const related = relatedArticles(article, 3);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(article.title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div data-testid="article-page" className="pb-24">
      <ReadingProgress />
      <article>
        <header className="wrap pt-8 sm:pt-12">
          <nav className="flex items-center gap-2 text-[0.82rem] text-muted" data-testid="article-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/category/${cat.slug}`} className="hover:text-ink transition-colors">{cat.name}</Link>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9 rise rise-1">
              <CategoryTag slug={article.category} variant="lime" />
              <h1
                data-testid="article-title"
                className="display mt-5 text-[2.4rem] sm:text-[3.6rem] lg:text-[4.6rem] leading-[0.96] tracking-[-0.035em]"
              >
                {article.title}
              </h1>
            </div>
          </div>

          <p className="mt-7 max-w-[46rem] text-[1.2rem] sm:text-[1.35rem] leading-[1.5] text-body rise rise-2" data-testid="article-dek">
            {article.dek}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rise rise-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-lime font-display text-[0.95rem] font-bold text-onlime">
                {initials(article.author)}
              </span>
              <div>
                <p className="text-[0.95rem] font-semibold text-ink" data-testid="article-author">{article.author}</p>
                <p className="meta mt-0.5">
                  <time dateTime={article.date} data-testid="article-date">{formatDate(article.date)}</time>
                  <span className="mx-1.5">·</span>
                  <span data-testid="article-readtime">{article.readTime} min read</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={copyLink} data-testid="article-share-copy" className={shareCls}>
                {copied ? <Check size={14} /> : <Link2 size={14} />}
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noreferrer"
                data-testid="article-share-x"
                className={shareCls}
              >
                Post on X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noreferrer"
                data-testid="article-share-linkedin"
                className={shareCls}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </header>

        <figure className="wrap mt-10 rise rise-4">
          <div className="tile aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
            <img src={article.image} alt={article.imageCaption || article.title} />
          </div>
          {article.imageCaption && (
            <figcaption className="mt-3 max-w-[44rem] text-[0.82rem] leading-relaxed text-muted">{article.imageCaption}</figcaption>
          )}
        </figure>

        <div className="wrap mt-14 sm:mt-20 grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-6">
              <div>
                <p className="eyebrow">Section</p>
                <Link to={`/category/${cat.slug}`} className="mt-1.5 block font-display text-[1.1rem] font-bold text-ink hover:text-acc transition-colors">
                  {cat.name}
                </Link>
              </div>
              <div>
                <p className="eyebrow">Written by</p>
                <p className="mt-1.5 text-[0.95rem] font-semibold text-ink">{article.author}</p>
                <p className="text-[0.85rem] text-muted">{article.authorRole}</p>
              </div>
              {!!article.tags?.length && (
                <div>
                  <p className="eyebrow">Topics</p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {article.tags.map((t) => (
                      <li key={t}>
                        <Link to={`/search?q=${encodeURIComponent(t)}`} className="chip-ghost hover:bg-ink hover:text-bg transition-colors">
                          {t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          <div className="lg:col-span-7 prose-dsd">
            {blocks.map((b, i) => (
              <Block key={i} b={b} first={i === 0} />
            ))}

            {!!article.tags?.length && (
              <ul className="mt-10 flex flex-wrap gap-2 lg:hidden" aria-label="Topics">
                {article.tags.map((t) => (
                  <li key={t}>
                    <Link to={`/search?q=${encodeURIComponent(t)}`} className="chip-ghost hover:bg-ink hover:text-bg transition-colors">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-12 border-t hairline pt-6 text-[0.9rem] leading-relaxed text-muted">
              {article.author} is {/^[AEIOU]/i.test(article.authorRole) ? "an" : "a"} {article.authorRole.toLowerCase()} at Dubai Startups Daily.
              Tips and corrections:{" "}
              <a href="mailto:desk@dubaistartupsdaily.ae" className="font-semibold text-ink underline decoration-lime decoration-2 underline-offset-4">
                desk@dubaistartupsdaily.ae
              </a>
            </p>

            <div className="mt-10">
              <Briefing variant="inline" />
            </div>
          </div>
        </div>
      </article>

      {!!related.length && (
        <section className="wrap mt-24" data-testid="article-related">
          <SectionHead eyebrow="Keep reading" title="Up next" to={`/category/${cat.slug}`} linkLabel={`More ${cat.short.toLowerCase()}`} />
          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <StoryCard article={a} aspect="aspect-[3/2]" />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticlePage;
