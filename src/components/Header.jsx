import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Search, X } from "lucide-react";
import { CATEGORIES } from "@/data/articles";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./Logo";
import SectionNav from "./SectionNav";

const ThemeSwitch = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-testid="header-theme-toggle"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      className="relative h-7 w-12 shrink-0 rounded-full bg-raised transition-colors hover:bg-ink/15"
    >
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? "translate-x-5" : ""
        }`}
      >
        <span className={`absolute inset-[5px] rounded-full ${isDark ? "bg-lime" : "bg-bg"}`} />
      </span>
    </button>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // close overlays on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement?.tagName || "")) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip btn-lime">
        Skip to content
      </a>


      <header data-testid="site-header" className="sticky top-0 z-header border-b hairline bg-bg/80 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center gap-6">
          <Link to="/" data-testid="masthead-logo" aria-label="Dubai Startups Daily home" className="shrink-0">
            <Logo />
          </Link>

          <SectionNav />

          <nav className="hidden xl:flex items-center gap-1 border-l hairline pl-3 text-[0.84rem]">
            <NavLink
              to="/setup"
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-full transition-colors ${isActive ? "bg-raised text-lime font-semibold" : "text-muted hover:text-ink"}`
              }
            >
              Setup
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-full transition-colors ${isActive ? "bg-raised text-lime font-semibold" : "text-muted hover:text-ink"}`
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-full transition-colors ${isActive ? "bg-raised text-lime font-semibold" : "text-muted hover:text-ink"}`
              }
            >
              Jobs
            </NavLink>
          </nav>

          <div className="ml-auto lg:ml-0 flex items-center gap-2 sm:gap-3">
            <button
              data-testid="header-search-button"
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 rounded-full bg-raised pl-3 pr-2 py-1.5 text-[0.85rem] text-muted hover:text-ink transition-colors"
            >
              <Search size={15} strokeWidth={2} />
              <span className="hidden sm:inline pr-6">Search</span>
              <kbd className="hidden sm:grid h-5 min-w-5 place-items-center rounded-[5px] bg-bg px-1 font-mono text-[0.68rem] text-muted">/</kbd>
            </button>
            <span className="hidden sm:flex"><ThemeSwitch /></span>
            <button
              data-testid="mobile-menu-button"
              className="lg:hidden flex h-9 items-center gap-2 rounded-full bg-ink px-3.5 text-[0.82rem] font-semibold text-bg"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-overlay bg-bg/70 backdrop-blur-md rise"
          onMouseDown={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          data-testid="header-search-panel"
        >
          <div className="wrap pt-24 sm:pt-32">
            <form onSubmit={submit} className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 rounded-tile bg-surface p-2 pl-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.5)] ring-1 ring-line/10">
                <Search size={20} className="shrink-0 text-muted" />
                <input
                  ref={inputRef}
                  data-testid="header-search-input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search companies, founders, topics"
                  aria-label="Search"
                  className="min-w-0 flex-1 bg-transparent py-3 font-display text-[1.25rem] sm:text-[1.5rem] font-semibold tracking-[-0.02em] text-ink placeholder:text-muted/70 outline-none"
                />
                <button type="submit" data-testid="header-search-submit" className="btn-lime py-2.5">
                  Search
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between text-[0.8rem] text-muted">
                <span>Press Enter to search the archive</span>
                <button type="button" onClick={() => setSearchOpen(false)} className="inline-flex items-center gap-1 hover:text-ink">
                  <X size={14} /> Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-overlay flex flex-col bg-bg lg:hidden" data-testid="mobile-nav" role="dialog" aria-label="Menu">
          <div className="wrap flex h-16 w-full items-center justify-between border-b hairline">
            <Logo />
            <button onClick={() => setMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-raised text-ink" aria-label="Close menu">
              <X size={18} />
            </button>
          </div>
          <nav className="wrap w-full flex-1 overflow-y-auto py-6">
            {[{ slug: "", name: "Home" }, ...CATEGORIES].map((c, i) => (
              <Link
                key={c.slug || "home"}
                to={c.slug ? `/category/${c.slug}` : "/"}
                data-testid={c.slug ? `mobile-nav-${c.slug}` : "mobile-nav-home"}
                className="group flex items-center justify-between border-b hairline py-4 rise"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="display text-[2rem] leading-none">{c.name}</span>
                <ArrowUpRight size={22} className="text-muted group-hover:text-acc transition-colors" />
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t hairline">
              <p className="font-mono text-[0.72rem] uppercase tracking-wider text-muted px-1 mb-2">Ecosystem</p>
              {[
                { to: "/setup", name: "Business Setup & Guides" },
                { to: "/events", name: "Startup Events" },
                { to: "/jobs", name: "Startup Jobs" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between py-3 border-b hairline text-ink"
                >
                  <span className="font-display text-[1.4rem] font-bold">{item.name}</span>
                  <ArrowUpRight size={18} className="text-muted group-hover:text-acc transition-colors" />
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Link to="/about" className="text-[0.95rem] text-muted">About the newsroom</Link>
              <span className="flex items-center gap-3 text-[0.9rem] text-muted">Dark mode <ThemeSwitch /></span>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
