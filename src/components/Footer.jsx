import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/articles";
import Logo from "./Logo";

const linkCls = "text-[0.9rem] text-body hover:text-ink transition-colors duration-200";

const Footer = () => (
  <footer data-testid="site-footer" className="mt-auto border-t hairline bg-bg overflow-hidden">
    <div className="wrap pt-14 pb-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" data-testid="footer-logo"><Logo /></Link>
          <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-muted">
            Independent reporting on the startups, capital and technology shaping Dubai and the UAE.
          </p>
          <a
            href="mailto:desk@dubaistartupsdaily.ae"
            data-testid="footer-contact"
            className="group mt-6 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-ink"
          >
            desk@dubaistartupsdaily.ae
            <ArrowUpRight size={16} className="text-acc transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <nav data-testid="footer-sections" aria-label="Sections" className="md:col-span-4">
          <p className="eyebrow">Sections</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`} data-testid={`footer-category-${c.slug}`} className={linkCls}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav data-testid="footer-company" aria-label="Newsroom" className="md:col-span-3">
          <p className="eyebrow">Newsroom</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/about" data-testid="footer-about" className={linkCls}>About us</Link></li>
            <li><Link to="/search" data-testid="footer-search" className={linkCls}>Search the archive</Link></li>
            <li><a href="mailto:desk@dubaistartupsdaily.ae?subject=Tip" className={linkCls}>Send a tip</a></li>
            <li><Link to="/" data-testid="footer-home" className={linkCls}>Home</Link></li>
          </ul>
        </nav>
      </div>

      <p
        aria-hidden="true"
        className="display mt-16 select-none text-center text-[19vw] lg:text-[15.5rem] leading-[0.8] tracking-[-0.06em] text-ink/[0.07]"
      >
        DUBAI·DAILY
      </p>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t hairline pt-6 text-[0.78rem] text-muted">
        <p>© 2026 Dubai Startups Daily · Demo build with sample reporting</p>
        <p className="flex gap-5">
          <Link to="/about" className="hover:text-ink transition-colors">Privacy</Link>
          <Link to="/about" className="hover:text-ink transition-colors">Terms</Link>
          <Link to="/about" className="hover:text-ink transition-colors">Corrections</Link>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
