import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { searchArticles, trendingArticles, formatDate } from "@/data/articles";
import CategoryTag from "@/components/CategoryTag";
import { StoryCard } from "@/components/ArticleCard";

const SUGGESTED = ["Series B", "AI", "DIFC", "Fintech", "Logistics", "Real estate", "Climate"];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Highlight = ({ text, q }) => {
  const terms = q.trim().split(/\s+/).filter(Boolean).map(esc);
  if (!terms.length) return text;
  const parts = text.split(new RegExp(`\\b(${terms.join("|")})`, "gi"));
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-[3px] bg-lime px-0.5 text-onlime">{p}</mark>
    ) : (
      p
    )
  );
};

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setInput(q);
  }

  const results = searchArticles(q);
  const suggestions = trendingArticles(3);

  return (
    <div data-testid="search-page" className="min-h-[70vh] pb-24">
      <div className="wrap pt-12 sm:pt-16">
        <p className="eyebrow">Archive</p>
        <h1 className="display mt-2 text-[2.8rem] sm:text-[4.5rem] leading-[0.9]">Search</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParams(input.trim() ? { q: input.trim() } : {});
          }}
          className="mt-8 max-w-4xl"
          data-testid="search-form"
          role="search"
        >
          <div className="flex items-center gap-2 rounded-full bg-surface p-2 pl-5 ring-1 ring-line/10 focus-within:ring-2 focus-within:ring-ink transition-shadow">
            <SearchIcon size={20} className="shrink-0 text-muted" />
            <input
              data-testid="search-page-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Companies, founders, topics"
              aria-label="Search terms"
              className="min-w-0 flex-1 bg-transparent px-1 py-2.5 font-display text-[1.2rem] sm:text-[1.4rem] font-semibold tracking-[-0.02em] text-ink placeholder:text-muted/70 outline-none"
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
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink transition-colors"
              >
                <X size={17} />
              </button>
            )}
            <button type="submit" data-testid="search-page-submit" className="btn-lime">
              Search
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setParams({ q: s })}
              className={`chip-ghost py-1 hover:bg-ink hover:text-bg transition-colors ${q.toLowerCase() === s.toLowerCase() ? "!bg-ink !text-bg" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        {q ? (
          <div className="mt-14 max-w-5xl" data-testid="search-results-section">
            <p className="text-[0.95rem] text-muted" aria-live="polite">
              <span className="display text-[1.4rem] tabular-nums">{results.length}</span>{" "}
              {results.length === 1 ? "result" : "results"} for “{q}”
            </p>

            {!results.length ? (
              <div className="mt-6 rounded-tile bg-surface p-10 ring-1 ring-line/10" data-testid="search-no-results">
                <p className="display text-[1.6rem]">Nothing matched “{q}”.</p>
                <p className="mt-2 text-muted">Check the spelling, use fewer words, or try one of the topics above.</p>
              </div>
            ) : (
              <ol className="mt-4 border-t hairline">
                {results.map((a) => (
                  <li key={a.slug} className="group relative grid gap-5 border-b hairline py-7 sm:grid-cols-[1fr_10rem]">
                    <div>
                      <div className="flex items-center gap-3">
                        <CategoryTag slug={a.category} />
                        <span className="meta">{formatDate(a.date)}</span>
                      </div>
                      <h2 className="mt-3 font-display text-[1.45rem] sm:text-[1.7rem] font-bold leading-[1.06] tracking-[-0.03em] text-ink">
                        <Link to={`/article/${a.slug}`} className="after:absolute after:inset-0">
                          <Highlight text={a.title} q={q} />
                        </Link>
                      </h2>
                      <p className="mt-2.5 max-w-[44rem] text-[0.95rem] leading-relaxed text-muted">
                        <Highlight text={a.dek} q={q} />
                      </p>
                      <p className="meta mt-3">{a.author} · {a.readTime} min read</p>
                    </div>
                    <div className="hidden sm:block tile aspect-[4/3] !rounded-card">
                      <img src={a.image} alt="" loading="lazy" />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ) : (
          <div className="mt-16" data-testid="search-suggestions">
            <h2 className="display text-[1.8rem]">Most read this week</h2>
            <div className="mt-6 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((a) => (
                <StoryCard key={a.slug} article={a} aspect="aspect-[3/2]" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
