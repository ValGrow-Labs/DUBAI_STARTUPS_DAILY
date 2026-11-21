import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CATEGORIES } from "@/data/articles";

const EASE = "cubic-bezier(0.34, 1.3, 0.64, 1)"; // slight overshoot, feels springy

/**
 * Section tabs with a pill that slides to the active tab,
 * and a faint hover pill that follows the pointer.
 */
const SectionNav = () => {
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const items = useRef({});
  const [active, setActive] = useState(null); // {x, w}
  const [hover, setHover] = useState(null);
  const [ready, setReady] = useState(false); // skip the slide on first paint

  const measure = useCallback((el) => {
    if (!el || !navRef.current) return null;
    return { x: el.offsetLeft, w: el.offsetWidth };
  }, []);

  useLayoutEffect(() => {
    const slug = CATEGORIES.find((c) => pathname.startsWith(`/category/${c.slug}`))?.slug;
    const update = () => setActive(slug ? measure(items.current[slug]) : null);
    update();
    const id = requestAnimationFrame(() => setReady(true));
    // fonts load after first paint and change widths
    document.fonts?.ready.then(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", update);
    };
  }, [pathname, measure]);

  const pill = (p) => ({
    transform: `translateX(${p?.x ?? 0}px)`,
    width: p?.w ?? 0,
  });

  return (
    <nav
      ref={navRef}
      data-testid="main-nav"
      aria-label="Sections"
      className="relative hidden lg:flex items-center gap-1 mx-auto"
      onMouseLeave={() => setHover(null)}
    >
      {/* hover pill */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full rounded-full bg-ink/[0.07]"
        style={{
          ...pill(hover),
          opacity: hover ? 1 : 0,
          transition: `transform 350ms ${EASE}, width 350ms ${EASE}, opacity 200ms ease`,
        }}
      />
      {/* active pill */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full rounded-full bg-ink shadow-[0_6px_20px_-8px_rgb(var(--lime)/0.55)]"
        style={{
          ...pill(active),
          opacity: active ? 1 : 0,
          transition: ready
            ? `transform 500ms ${EASE}, width 500ms ${EASE}, opacity 250ms ease`
            : "none",
        }}
      />

      {CATEGORIES.map((c) => {
        const isActive = pathname.startsWith(`/category/${c.slug}`);
        return (
          <NavLink
            key={c.slug}
            ref={(el) => (items.current[c.slug] = el)}
            to={`/category/${c.slug}`}
            data-testid={`nav-${c.slug}`}
            onMouseEnter={(e) => setHover(measure(e.currentTarget))}
            onFocus={(e) => setHover(measure(e.currentTarget))}
            onBlur={() => setHover(null)}
            className={`relative z-10 rounded-full px-3.5 py-1.5 text-[0.86rem] font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-acc ${
              isActive ? "text-bg" : "text-body hover:text-ink"
            }`}
          >
            <span className={`inline-block transition-transform duration-300 ${isActive ? "scale-[1.02]" : ""}`}>{c.short}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default SectionNav;
