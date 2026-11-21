import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/articles";

const Footer = () => (
  <footer data-testid="site-footer" className="bg-ink dark:bg-navy-950 text-white border-t border-transparent dark:border-white/10 mt-auto transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <Link to="/" data-testid="footer-logo" className="flex items-center gap-3">
          <span className="w-9 h-9 bg-gold flex items-center justify-center">
            <span className="font-headline font-black text-ink text-xl leading-none">D</span>
          </span>
          <span className="font-headline font-black text-2xl tracking-tight">
            DUBAI STARTUPS <span className="italic text-gold">DAILY</span>
          </span>
        </Link>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
          A trusted digital destination for Dubai’s startup, business and technology news — covering the
          companies, capital and ideas building the city.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          Demo build featuring sample editorial content
        </p>
      </div>

      <nav data-testid="footer-sections">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gold pb-3 border-b border-white/15">
          Sections
        </h3>
        <ul className="mt-4 space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/category/${c.slug}`}
                data-testid={`footer-category-${c.slug}`}
                className="text-sm text-white/75 hover:text-gold transition-colors duration-200 inline-flex items-center gap-1"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav data-testid="footer-company">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gold pb-3 border-b border-white/15">
          Company
        </h3>
        <ul className="mt-4 space-y-2.5">
          <li>
            <Link to="/about" data-testid="footer-about" className="text-sm text-white/75 hover:text-gold transition-colors duration-200">
              About & Mission
            </Link>
          </li>
          <li>
            <Link to="/search" data-testid="footer-search" className="text-sm text-white/75 hover:text-gold transition-colors duration-200">
              Search the Archive
            </Link>
          </li>
          <li>
            <Link to="/" data-testid="footer-home" className="text-sm text-white/75 hover:text-gold transition-colors duration-200">
              Front Page
            </Link>
          </li>
        </ul>
        <a
          href="mailto:desk@dubaistartupsdaily.ae"
          data-testid="footer-contact"
          className="mt-6 inline-flex items-center gap-1.5 border border-gold/50 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-ink transition-colors duration-200"
        >
          Contact the desk <ArrowUpRight size={13} />
        </a>
      </nav>
    </div>

    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
          © 2026 Dubai Startups Daily
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
          Made in Dubai, for the builders of the Gulf
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
