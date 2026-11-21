import { useParams, Link } from "react-router-dom";
import { ArrowRight, FileSearch } from "lucide-react";
import { getCategory, byCategory } from "@/data/articles";
import { ArticleCardStandard, ArticleCardRow } from "@/components/ArticleCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const cat = getCategory(slug);
  const arts = byCategory(slug);

  if (!cat) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center" data-testid="category-not-found">
        <h1 className="font-headline font-black text-4xl text-ink dark:text-white">Section not found</h1>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-gold">
          Back to the front page <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const dark = cat.dark;
  const [first, ...rest] = arts;

  return (
    <div data-testid="category-page" className="bg-white dark:bg-navy-950 transition-colors duration-200">
      {/* Section banner */}
      <section className={dark ? "bg-ink dark:bg-navy-900" : "bg-mist dark:bg-navy-900/60"}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <nav className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-slate-400" data-testid="category-breadcrumb">
            <Link to="/" className="hover:text-gold transition-colors duration-200">Home</Link>
            <span className="mx-2">/</span>
            <span className={dark ? "text-gold" : "text-ink dark:text-gold"}>{cat.name}</span>
          </nav>
          <h1 className={`font-headline font-black text-5xl sm:text-6xl leading-[1.02] mt-4 ${dark ? "text-white" : "text-ink dark:text-white"}`} data-testid="category-title">
            {cat.name}
          </h1>
          <p className={`mt-4 max-w-2xl text-[15px] leading-relaxed ${dark ? "text-white/65" : "text-neutral-600 dark:text-slate-300"}`}>
            {cat.description}
          </p>
          <p className={`mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold`} data-testid="category-count">
            {arts.length} {arts.length === 1 ? "story" : "stories"} published
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-navy-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-14">
          {!arts.length ? (
            <div className="text-center py-16" data-testid="category-empty">
              <FileSearch size={36} className="mx-auto text-neutral-300 dark:text-slate-600" />
              <p className="mt-4 font-headline text-xl text-neutral-600 dark:text-slate-400">No stories in this section yet.</p>
              <Link to="/" className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-gold hover:underline">
                Return to front page
              </Link>
            </div>
          ) : (
            <>
              {/* Featured in section */}
              {first && (
                <div className="pb-12 border-b border-neutral-200 dark:border-white/10" data-testid="category-featured">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Lead story</span>
                  <div className="mt-4 grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7">
                      <Link to={`/article/${first.slug}`} className="block img-zoom">
                        <div className="aspect-[16/10] bg-mist dark:bg-navy-900 border border-transparent dark:border-white/5">
                          <img src={first.image} alt={first.title} className="w-full h-full object-cover" />
                        </div>
                      </Link>
                    </div>
                    <div className="lg:col-span-5">
                      <Link to={`/article/${first.slug}`}>
                        <h2 className="font-headline font-bold text-2xl sm:text-4xl leading-[1.12] text-ink dark:text-white hover:text-gold transition-colors duration-300">
                          {first.title}
                        </h2>
                      </Link>
                      <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-slate-300">{first.dek}</p>
                      <div className="mt-6 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-slate-400">
                        <span>{first.author}</span> · <span>{first.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of the rest */}
              {!!rest.length && (
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="category-grid">
                  {rest.map((a) => (
                    <ArticleCardStandard key={a.slug} article={a} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
