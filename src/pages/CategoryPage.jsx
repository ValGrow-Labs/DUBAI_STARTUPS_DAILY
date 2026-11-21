import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, getCategory, byCategory } from "@/data/articles";
import { StoryOverlay, StoryCard } from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";

const CategoryPage = () => {
  const { slug } = useParams();
  const cat = getCategory(slug);
  const arts = byCategory(slug);

  useEffect(() => {
    document.title = cat ? `${cat.name} · Dubai Startups Daily` : "Dubai Startups Daily";
    return () => {
      document.title = "Dubai Startups Daily";
    };
  }, [cat]);

  if (!cat) {
    return (
      <div className="wrap py-28" data-testid="category-not-found">
        <p className="eyebrow">Not found</p>
        <h1 className="display mt-3 text-[2.8rem] sm:text-[4rem] leading-[0.95]">That section doesn’t exist.</h1>
        <Link to="/" className="btn-lime mt-8">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  const [first, ...rest] = arts;

  return (
    <div data-testid="category-page" className="pb-24">
      <section className="wrap pt-10 sm:pt-14">
        <nav className="flex items-center gap-2 text-[0.82rem] text-muted" data-testid="category-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{cat.name}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h1
            className="display text-[3.2rem] sm:text-[5.5rem] lg:text-[7.5rem] leading-[0.88] tracking-[-0.045em] rise rise-1"
            data-testid="category-title"
          >
            {cat.name}
          </h1>
          <div className="max-w-[22rem] pb-2 rise rise-2">
            <p className="text-[1rem] leading-relaxed text-body">{cat.description}</p>
            <p className="mt-3">
              <span className="chip" data-testid="category-count">
                {arts.length} {arts.length === 1 ? "story" : "stories"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              aria-current={c.slug === cat.slug ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-[0.86rem] font-semibold transition-colors ${
                c.slug === cat.slug ? "bg-ink text-bg" : "bg-surface text-body ring-1 ring-line/10 hover:text-ink hover:ring-line/30"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap mt-10">
        {!arts.length ? (
          <div className="rounded-tile bg-surface p-10 sm:p-16 text-center ring-1 ring-line/10" data-testid="category-empty">
            <p className="display text-[1.8rem]">Nothing filed here yet.</p>
            <p className="mt-2 text-muted">Our reporters are on it. Meanwhile, today’s news is on the home page.</p>
            <Link to="/" className="btn-lime mt-6">Go home</Link>
          </div>
        ) : (
          <>
            {first && (
              <div data-testid="category-featured" className="rise rise-3">
                <StoryOverlay article={first} eager className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" />
              </div>
            )}
            {!!rest.length && (
              <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" data-testid="category-grid">
                {rest.map((a, i) => (
                  <Reveal key={a.slug} delay={(i % 3) * 90}>
                    <StoryCard article={a} aspect="aspect-[4/3]" showDek />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
