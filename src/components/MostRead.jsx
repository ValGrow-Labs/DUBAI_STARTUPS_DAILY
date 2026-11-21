import { Link } from "react-router-dom";
import { trendingArticles } from "@/data/articles";

export const MostRead = ({ count = 5, className = "" }) => {
  const list = trendingArticles(count);
  return (
    <aside data-testid="most-read-list" className={`rounded-tile bg-surface p-6 ring-1 ring-line/10 ${className}`} aria-labelledby="most-read-heading">
      <div className="flex items-center justify-between">
        <h2 id="most-read-heading" className="display text-[1.4rem]">Most read</h2>
        <span className="eyebrow">This week</span>
      </div>
      <ol className="mt-3">
        {list.map((a, i) => (
          <li key={a.slug} data-testid={`most-read-item-${i + 1}`} className="group border-t hairline first:border-0">
            <Link to={`/article/${a.slug}`} className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">
              <span className="display text-[1.9rem] leading-[0.85] text-ink/20 transition-colors duration-300 group-hover:text-acc tabular-nums">
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-[1.02rem] font-semibold leading-[1.18] tracking-[-0.02em] text-ink">
                  <span className="title-link">{a.title}</span>
                </span>
                <span className="meta mt-1.5 block">{a.readTime} min read</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
};

export default MostRead;
