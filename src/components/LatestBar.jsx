import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { latestArticles, getCategory, formatDate } from "@/data/articles";

const DURATION = 5000;

/** Compact rotating "latest" headline. Auto-advances, pauses on hover/focus. */
const LatestBar = ({ className = "" }) => {
  const items = latestArticles(7);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % items.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, items.length]);

  const go = (d) => setI((n) => (n + d + items.length) % items.length);
  const a = items[i];
  const cat = getCategory(a.category);

  return (
    <div
      data-testid="news-ticker"
      className={`w-full ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 eyebrow text-ink">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          Latest
          <span className="text-muted/60 tabular-nums">
            {String(i + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous headline"
            className="grid h-7 w-7 place-items-center rounded-full text-muted ring-1 ring-line/10 hover:bg-ink hover:text-bg hover:ring-transparent transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next headline"
            className="grid h-7 w-7 place-items-center rounded-full text-muted ring-1 ring-line/10 hover:bg-ink hover:text-bg hover:ring-transparent transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </span>
      </div>

      <div className="relative mt-2.5 h-[2.6rem] md:h-[1.4rem] overflow-hidden" aria-live={paused ? "polite" : "off"}>
        <Link key={a.slug} to={`/article/${a.slug}`} className="ticker-in group absolute inset-0 block">
          <span className="block font-display text-[1.02rem] font-semibold leading-[1.25] tracking-[-0.015em] text-ink line-clamp-2 md:line-clamp-1">
            <span className="title-link">{a.title}</span>
          </span>
        </Link>
      </div>

      <div className="mt-1.5 flex items-center gap-2 meta">
        <span className="font-sans text-[0.75rem] font-semibold text-acc">{cat?.short}</span>
        <span>·</span>
        <span>{formatDate(a.date).replace(/ \d{4}$/, "")}</span>
      </div>

      <div aria-hidden="true" className="mt-2.5 h-[2px] w-full overflow-hidden rounded-full bg-line/10">
        <div
          key={`${i}-${paused}`}
          className="h-full origin-left rounded-full bg-lime"
          style={{
            animation: `ticker-progress ${DURATION}ms linear forwards`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
};

export default LatestBar;
