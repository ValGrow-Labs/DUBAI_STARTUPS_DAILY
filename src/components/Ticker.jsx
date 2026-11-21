import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import { latestArticles } from "@/data/articles";

const Ticker = () => {
  const items = latestArticles(6);
  const doubled = [...items, ...items];
  return (
    <div data-testid="news-ticker" className="bg-gold text-ink overflow-hidden border-b border-ink/20">
      <div className="flex items-stretch">
        <div className="shrink-0 flex items-center gap-1.5 bg-ink text-gold px-4 py-1.5 z-10">
          <Radio size={12} strokeWidth={2.6} className="animate-pulse" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">Latest</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex w-max items-center whitespace-nowrap py-1.5">
            {doubled.map((a, i) => (
              <Link
                key={`${a.slug}-${i}`}
                to={`/article/${a.slug}`}
                data-testid={`ticker-item-${i}`}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] px-6 hover:text-white transition-colors duration-200"
              >
                {a.title}
                <span className="pl-6 text-ink/50">///</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
