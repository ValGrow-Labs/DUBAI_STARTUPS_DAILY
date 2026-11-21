import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { trendingArticles } from "@/data/articles";

export const MostRead = () => {
  const list = trendingArticles(5);
  return (
    <aside data-testid="most-read-list" className="bg-ink dark:bg-navy-900 text-white p-7 border dark:border-white/10 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-2 border-b border-white/15 pb-4">
        <Flame size={16} className="text-gold" strokeWidth={2.4} />
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em]">Most Read</h3>
      </div>
      <ol className="mt-2">
        {list.map((a, i) => (
          <li key={a.slug} data-testid={`most-read-item-${i + 1}`} className="group border-b border-white/10 last:border-0">
            <Link to={`/article/${a.slug}`} className="flex gap-4 py-4">
              <span className="font-headline italic font-bold text-2xl text-gold leading-none w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="font-headline font-bold text-[15px] leading-snug text-white group-hover:text-gold transition-colors duration-300">
                  {a.title}
                </h4>
                <span className="mt-1.5 inline-block font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {a.author}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-6 border border-gold/40 dark:border-gold/30 p-5 bg-transparent dark:bg-navy-950/40">
        <p className="font-headline font-bold text-lg leading-snug text-white">
          Dubai Startups Daily covers the people, capital and technology building the city.
        </p>
        <Link
          to="/about"
          data-testid="most-read-about-link"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold hover:text-white transition-colors duration-200"
        >
          Our mission
        </Link>
      </div>
    </aside>
  );
};

export default MostRead;
