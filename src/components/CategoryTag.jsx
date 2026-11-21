import { Link } from "react-router-dom";
import { getCategory } from "@/data/articles";

const styles = {
  gold: "bg-gold text-ink",
  ink: "bg-ink text-white",
  tech: "bg-tech text-white",
};

export const CategoryTag = ({ slug, className = "", testid }) => {
  const cat = getCategory(slug);
  if (!cat) return null;
  return (
    <Link
      to={`/category/${cat.slug}`}
      data-testid={testid || `category-tag-${cat.slug}`}
      className={`inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 transition-colors duration-200 hover:bg-ink hover:text-gold ${
        styles[cat.accent] || styles.gold
      } ${className}`}
    >
      {cat.name}
    </Link>
  );
};

export default CategoryTag;
