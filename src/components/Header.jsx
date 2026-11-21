import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, X, Sun, Moon } from "lucide-react";
import { CATEGORIES } from "@/data/articles";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
    setQ("");
  };

  const navLink = ({ isActive }) =>
    `relative font-mono text-[11px] font-semibold uppercase tracking-[0.14em] py-3.5 px-1 transition-colors duration-200 ${
      isActive ? "text-gold" : "text-white/85 hover:text-gold"
    } after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gold after:scale-x-0 after:transition-transform after:duration-300 after:origin-left ${
      isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
    }`;

  return (
    <header data-testid="site-header" className="sticky top-0 z-50">
      {/* Masthead */}
      <div className="bg-white dark:bg-navy-950 border-b border-neutral-200 dark:border-white/10 transition-colors duration-250">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            data-testid="mobile-menu-button"
            className="lg:hidden p-2 -ml-2 text-ink dark:text-white hover:text-gold transition-colors duration-200"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" data-testid="masthead-logo" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-ink dark:bg-navy-900 border dark:border-gold/30 flex items-center justify-center">
              <span className="font-headline font-black text-gold text-lg sm:text-xl leading-none">D</span>
            </span>
            <span className="font-headline font-black text-lg sm:text-[28px] leading-none tracking-tight whitespace-nowrap text-ink dark:text-white">
              DUBAI STARTUPS <span className="italic text-gold">DAILY</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              data-testid="header-theme-toggle"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="flex items-center gap-1.5 border border-ink dark:border-white/20 p-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink dark:text-white hover:bg-ink hover:text-gold dark:hover:bg-gold dark:hover:text-ink transition-colors duration-200"
            >
              {isDark ? <Sun size={14} className="text-gold" /> : <Moon size={14} />}
            </button>

            {/* Search Trigger */}
            <button
              data-testid="header-search-button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex items-center gap-2 border border-ink dark:border-white/20 px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink dark:text-white hover:bg-ink hover:text-gold dark:hover:bg-gold dark:hover:text-ink transition-colors duration-200"
            >
              {searchOpen ? <X size={14} /> : <Search size={14} strokeWidth={2.6} />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-neutral-200 dark:border-white/10 bg-mist dark:bg-navy-900" data-testid="header-search-panel">
            <form onSubmit={submit} className="max-w-7xl mx-auto px-6 py-3 flex gap-3">
              <input
                ref={inputRef}
                data-testid="header-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search funding, founders, AI, markets…"
                className="flex-1 bg-white dark:bg-navy-800 border border-neutral-300 dark:border-white/15 focus:border-gold outline-none px-4 py-2.5 text-[15px] text-ink dark:text-white placeholder:text-neutral-400 dark:placeholder:text-slate-500 transition-colors duration-200"
              />
              <button
                type="submit"
                data-testid="header-search-submit"
                className="bg-ink dark:bg-gold text-white dark:text-ink font-mono text-[11px] font-semibold uppercase tracking-[0.14em] px-5 hover:bg-gold hover:text-ink dark:hover:bg-white transition-colors duration-200"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="bg-ink dark:bg-navy-900 border-t-2 border-gold shadow-md" data-testid="main-nav">
        <div className="max-w-7xl mx-auto px-6 hidden lg:flex items-center gap-7">
          <NavLink to="/" end className={navLink} data-testid="nav-home">
            Home
          </NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c.slug} to={`/category/${c.slug}`} className={navLink} data-testid={`nav-${c.slug}`}>
              {c.short}
            </NavLink>
          ))}
        </div>
        {menuOpen && (
          <div className="lg:hidden px-6 py-2" data-testid="mobile-nav">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/85 hover:text-gold transition-colors duration-200 border-b border-white/10"
              data-testid="mobile-nav-home"
            >
              Home
            </NavLink>
            {CATEGORIES.map((c) => (
              <NavLink
                key={c.slug}
                to={`/category/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/85 hover:text-gold transition-colors duration-200 border-b border-white/10 last:border-0"
                data-testid={`mobile-nav-${c.slug}`}
              >
                {c.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
