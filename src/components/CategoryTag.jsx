import { Link } from "react-router-dom";
import { getCategory } from "@/data/articles";

/** variant: "ghost" (outlined), "lime" (filled), "glass" (on images) */
export const CategoryTag = ({ slug, className = "", testid, variant = "ghost" }) => {
  const cat = getCategory(slug);
  if (!cat) return null;
  const styles = {
    ghost: "chip-ghost hover:bg-ink hover:text-bg",
    lime: "chip hover:bg-ink hover:text-bg",
    glass:
      "inline-flex items-center rounded-full bg-white/15 px-2.5 py-[0.2rem] text-[0.72rem] font-semibold text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-lime hover:text-onlime hover:ring-transparent",
  };
  return (
    <Link
      to={`/category/${cat.slug}`}
      data-testid={testid || `category-tag-${cat.slug}`}
      className={`relative z-10 transition-colors duration-200 ${styles[variant]} ${className}`}
    >
      {cat.short}
    </Link>
  );
};

export default CategoryTag;
