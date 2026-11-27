import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Accessible Breadcrumb navigation component with Microdata / Semantic HTML
 */
const Breadcrumb = ({ items = [], className = "" }) => {
  if (!items.length) return null;

  const trail = [{ name: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-[0.8rem] text-muted ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0">
        {trail.map((item, idx) => {
          const isLast = idx === trail.length - 1;
          return (
            <li key={item.path || idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight size={13} className="text-muted/60 shrink-0" aria-hidden="true" />}
              {isLast ? (
                <span className="font-medium text-ink truncate max-w-[200px] sm:max-w-[320px]" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-ink transition-colors flex items-center gap-1"
                >
                  {idx === 0 && <Home size={13} className="shrink-0" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
