import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { setArticles } from "@/data/articles";
import { LogoMark } from "@/components/Logo";

export const ARTICLES_KEY = ["articles"];

/**
 * Loads stories from the CMS and swaps them into the shared data module.
 * If the API is unreachable the site falls back to the bundled stories.
 */
export const ContentProvider = ({ children }) => {
  const { data, status, dataUpdatedAt } = useQuery({
    queryKey: ARTICLES_KEY,
    queryFn: api.articles,
    retry: 0,
    staleTime: 30_000,
  });

  if (status === "pending") {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bg" aria-busy="true" aria-label="Loading">
        <LogoMark size={44} className="animate-pulse" />
      </div>
    );
  }

  if (data) setArticles(data);

  // re-key so every page re-reads the list after the CMS changes it
  return (
    <div key={dataUpdatedAt} className="contents">
      {children}
    </div>
  );
};

export default ContentProvider;
