import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { searchArticles, trendingArticles, formatDate } from "@/data/articles";
import CategoryTag from "@/components/CategoryTag";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);

  useEffect(() => {
    setInput(q);
  }, [q]);

  const results = searchArticles(q);
  const suggestions = trendingArticles(5);

  return (
    <div data-testid="search-page" className="bg-mist dark:bg-navy-950 min-h-[70vh] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="font-headline font-black text-4xl sm:text-5xl text-ink dark:text-white">Search the archive</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParams(input.trim() ? { q: input.trim() } : {});
          }}
          className="mt-8 flex gap-3"
          data-testid="search-form"
        >
          <div className="relative flex-1">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-500" />
            <input
              data-testid="search-page-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try “funding”, “AI”, “founder”, “rent”…"
              className="w-full bg-white dark:bg-navy-850 border border-neutral-300 dark:border-white/15 focus:border-gold outline-none pl-11 pr-10 py-3.5 text-[15px] text-ink dark:text-white placeholder:text-neutral-400 dark:placeholder:text-slate-500 transition-colors duration-200"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setParams({});
                }}
                aria-label="Clear search"
                data-testid="search-clear-button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400 hover:text-ink dark:hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            data-testid="search-page-submit"
            className="bg-ink dark:bg-gold text-white dark:text-ink font-mono text-[11px] font-semibold uppercase tracking-[0.14em] px-6 py-3.5 hover:bg-gold hover:text-ink dark:hover:bg-white transition-colors duration-200"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {q ? (
          <div className="mt-12" data-testid="search-results-section">
            <div className="flex items-baseline justify-between border-b border-neutral-300 dark:border-white/10 pb-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-600 dark:text-slate-400">
                Found <span className="text-gold font-bold">{results.length}</span> {results.length === 1 ? "story" : "stories"} for “{q}”
              </p>
              {!!results.length && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-slate-500 hidden sm:inline">
                  Sorted by relevance
                </span>
              )}
            </div>

            {!results.length ? (
              <div className="py-16 text-center" data-testid="search-no-results">
                <p className="font-headline text-2xl text-neutral-700 dark:text-slate-300">No stories matched your search.</p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-slate-400">
                  Try broader terms like “AI”, “funding”, “DIFC” or browse the sections above.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-200 dark:divide-white/10 mt-2">
                {results.map((a) => (
                  <li key={a.slug} className="py-6">
                    <CategoryTag slug={a.category} className="mb-2" />
                    <Link to={`/article/${a.slug}`}>
                      <h2 className="font-headline font-bold text-2xl leading-snug text-ink dark:text-white hover:text-gold transition-colors duration-200">
                        {a.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-[15px] leading-relaxed text-neutral-600 dark:text-slate-300 max-w-3xl">{a.dek}</p>
                    <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{a.author}</span>
                      <span>·</span>
                      <span>{formatDate(a.date)}</span>
                      <span>·</span>
                      <span>{a.readTime} min read</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="mt-14" data-testid="search-suggestions">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-slate-400 mb-4">
              Trending stories right now
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {suggestions.map((a) => (
                <Link
                  key={a.slug}
                  to={`/article/${a.slug}`}
                  className="p-5 bg-white dark:bg-navy-900 border border-neutral-200 dark:border-white/10 hover:border-gold dark:hover:border-gold transition-colors duration-200 block"
                >
                  <CategoryTag slug={a.category} className="mb-2" />
                  <h3 className="font-headline font-bold text-lg text-ink dark:text-white hover:text-gold leading-snug">
                    {a.title}
                  </h3>
                  <span className="mt-2 inline-block font-mono text-[10px] uppercase text-neutral-400 dark:text-slate-400">
                    {a.author} · {a.readTime} min
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
