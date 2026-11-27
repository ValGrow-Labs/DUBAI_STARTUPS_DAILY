import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { setArticles } from "@/data/articles";
import { LogoMark } from "@/components/Logo";

export const ARTICLES_KEY = ["articles"];

/**
 * Loads published stories from Supabase and swaps them into the shared data module.
 * If Supabase returns empty results or errors, the site falls back to bundled stories.
 */
export const ContentProvider = ({ children }) => {
  const { data, status, error, dataUpdatedAt } = useQuery({
    queryKey: ARTICLES_KEY,
    queryFn: api.articles,
    retry: 0,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (status === "error" && error) {
      console.warn("[ContentProvider] Failed to load articles from Supabase:", error.message);
    } else if (status === "success" && Array.isArray(data) && data.length === 0) {
      console.info("[ContentProvider] No published articles returned from Supabase; keeping bundled fallback stories.");
    }
  }, [status, error, data]);

  if (status === "pending") {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bg" aria-busy="true" aria-label="Loading">
        <LogoMark size={44} className="animate-pulse" />
      </div>
    );
  }

  if (Array.isArray(data) && data.length > 0) setArticles(data);

  // re-key so every page re-reads the list after content updates
  return (
    <div key={dataUpdatedAt} className="contents">
      {children}
    </div>
  );
};

export default ContentProvider;
