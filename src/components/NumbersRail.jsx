import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { FIGURES, getArticle, getCategory } from "@/data/articles";

// Left inset that matches .wrap (max-w-page 90rem, px 1rem / 1.5rem / 2.5rem)
const railPad =
  "pl-[max(1rem,calc((100vw_-_90rem)/2_+_1rem))] sm:pl-[max(1.5rem,calc((100vw_-_90rem)/2_+_1.5rem))] lg:pl-[max(2.5rem,calc((100vw_-_90rem)/2_+_2.5rem))]";
const railScrollPad =
  "scroll-pl-[max(1rem,calc((100vw_-_90rem)/2_+_1rem))] sm:scroll-pl-[max(1.5rem,calc((100vw_-_90rem)/2_+_1.5rem))] lg:scroll-pl-[max(2.5rem,calc((100vw_-_90rem)/2_+_2.5rem))]";

const FigureCard = ({ f, index, lead, onActivate }) => {
  const a = getArticle(f.slug);
  if (!a) return null;
  const cat = getCategory(a.category);
  return (
    <Link
      to={`/article/${a.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`group relative flex h-full w-[16.5rem] sm:w-[19rem] flex-col overflow-hidden rounded-tile p-6 transition-[transform,box-shadow,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 ${
        lead
          ? "bg-lime text-onlime shadow-[0_24px_60px_-28px_rgb(var(--lime)/0.7)]"
          : "bg-surface ring-1 ring-line/10"
      }`}
    >
      {/* decoration */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-[1.5rem] transition-[transform,border-color] duration-700 group-hover:scale-110 ${
          lead ? "border-onlime/[0.07]" : "border-lime/[0.06]"
        }`}
      />

      <span className="relative flex items-center justify-between">
        <span className={`font-mono text-[0.7rem] tabular-nums transition-colors duration-500 ${lead ? "text-onlime/60" : "text-muted"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold transition-colors duration-500 ${
            lead ? "bg-onlime/10 text-onlime" : "text-body ring-1 ring-line/15"
          }`}
        >
          {cat?.short}
        </span>
      </span>

      <span
        className={`relative mt-10 block font-display text-[3.1rem] sm:text-[3.5rem] font-bold leading-none tracking-[-0.03em] tabular-nums transition-colors duration-500 ${
          lead ? "text-onlime" : "text-ink"
        }`}
      >
        {f.value}
      </span>

      <span className={`relative mt-3 block h-px w-10 ${lead ? "bg-onlime/30" : "bg-lime/60"} transition-[width,background-color] duration-500 group-hover:w-16`} />

      <span className="relative mt-auto flex items-end justify-between gap-4 pt-8">
        <span className={`text-[0.92rem] leading-snug transition-colors duration-500 ${lead ? "text-onlime/80" : "text-body"}`}>{f.label}</span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
            lead
              ? "bg-onlime text-lime"
              : "text-ink ring-1 ring-line/15"
          }`}
        >
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </span>
      <span className="sr-only">Read the story: {a.title}</span>
    </Link>
  );
};

const NumbersRail = () => {
  const scroller = useRef(null);
  const [active, setActive] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  const arrowCls =
    "grid h-10 w-10 place-items-center rounded-full ring-1 ring-line/15 text-ink transition-colors hover:bg-ink hover:text-bg hover:ring-transparent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink";

  return (
    <section className="pt-16 sm:pt-24" aria-labelledby="numbers-heading">
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">From our reporting</p>
          <h2 id="numbers-heading" className="display mt-2 text-[2.2rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95]">
            By the numbers
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button type="button" onClick={() => scrollBy(-1)} disabled={edge.start} aria-label="Previous figures" className={arrowCls}>
            <ArrowLeft size={17} />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={edge.end} aria-label="More figures" className={arrowCls}>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={update}
        className={`mt-8 overflow-x-auto no-scrollbar snap-x snap-mandatory ${railScrollPad}`}
      >
        <ul className={`flex w-max gap-4 pb-4 pt-2 pr-4 sm:pr-6 lg:pr-10 ${railPad}`}>
          {FIGURES.map((f, i) => (
            <li key={f.slug} className="snap-start">
              <FigureCard f={f} index={i} lead={i === active} onActivate={() => setActive(i)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NumbersRail;
