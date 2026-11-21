import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, featuredArticle, latestArticles, byCategory } from "@/data/articles";
import { ArticleCardLead, ArticleCardStandard, ArticleCardRow } from "@/components/ArticleCard";
import CategoryTag from "@/components/CategoryTag";
import MostRead from "@/components/MostRead";

const CategorySection = ({ cat, index }) => {
  const arts = byCategory(cat.slug);
  if (!arts.length) return null;
  const [lead, ...rest] = arts;
  const dark = cat.dark;
  const tinted = index % 2 === 1;

  return (
    <section
      data-testid={`category-section-${cat.slug}`}
      className={`${
        dark 
          ? "bg-ink dark:bg-navy-900" 
          : tinted 
            ? "bg-mist dark:bg-navy-900/40" 
            : "bg-white dark:bg-navy-950"
      } transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className={`flex items-end justify-between gap-6 border-t-[3px] ${dark ? "border-gold" : "border-ink dark:border-white/20"} pt-5`}>
          <div>
            {dark && (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Premium series</span>
            )}
            <h2 className={`font-headline font-black text-3xl sm:text-4xl leading-none mt-1 ${dark ? "text-white" : "text-ink dark:text-white"}`}>
              {cat.name}
            </h2>
          </div>
          <Link
            to={`/category/${cat.slug}`}
            data-testid={`category-all-${cat.slug}`}
            className={`shrink-0 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] border px-4 py-2 transition-colors duration-200 ${
              dark
                ? "border-gold/60 text-gold hover:bg-gold hover:text-ink"
                : "border-ink dark:border-white/30 text-ink dark:text-white hover:bg-ink hover:text-gold dark:hover:bg-gold dark:hover:text-ink"
            }`}
          >
            All {cat.short} <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-9 grid lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 reveal d1">
            <ArticleCardLead article={lead} light={dark} />
          </div>
          <div className={`flex flex-col gap-7 divide-y ${dark ? "divide-white/10" : "divide-neutral-200 dark:divide-white/10"} reveal d2`}>
            {rest.map((a) => (
              <div key={a.slug} className="pt-1 first:pt-0 pb-1">
                <ArticleCardRow article={a} light={dark} />
              </div>
            ))}
            {!rest.length && (
              <p className={`text-sm ${dark ? "text-white/60" : "text-neutral-500 dark:text-slate-400"}`}>More stories coming soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const hero = featuredArticle();
  const secondary = latestArticles(6).filter((a) => a.slug !== hero.slug).slice(0, 2);
  const latest = latestArticles(8).filter((a) => a.slug !== hero.slug && !secondary.includes(a)).slice(0, 4);

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="bg-white dark:bg-navy-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-14 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ArticleCardLead article={hero} className="reveal d1" />
            <div className="grid sm:grid-cols-2 gap-8 mt-12 pt-10 border-t border-neutral-200 dark:border-white/10">
              {secondary.map((a, i) => (
                <ArticleCardStandard key={a.slug} article={a} className={`reveal d${i + 2}`} />
              ))}
            </div>
          </div>
          <div className="reveal d2">
            <MostRead />
          </div>
        </div>
      </section>

      {/* Latest strip */}
      <section className="bg-white dark:bg-navy-950 border-t border-neutral-200 dark:border-white/10 transition-colors duration-200" data-testid="latest-strip">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-end justify-between gap-6 border-t-[3px] border-ink dark:border-white/20 pt-5">
            <h2 className="font-headline font-black text-3xl sm:text-4xl leading-none text-ink dark:text-white">The Latest</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-slate-400 hidden sm:block">
              Fresh from the newsroom
            </span>
          </div>
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latest.map((a, i) => (
              <ArticleCardStandard key={a.slug} article={a} className={`reveal d${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Category sections */}
      {CATEGORIES.map((cat, i) => (
        <CategorySection key={cat.slug} cat={cat} index={i} />
      ))}
    </div>
  );
};

export default HomePage;
