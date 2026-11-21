import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { api, getToken, setToken } from "@/lib/api";
import { ARTICLES_KEY } from "@/context/ContentContext";

export const useSession = () => {
  const [token, setTok] = useState(getToken);
  const { data, isPending } = useQuery({
    queryKey: ["session", token],
    queryFn: api.session,
    enabled: !!token,
    retry: 0,
    staleTime: 60_000,
  });
  const signIn = useCallback((t) => {
    setToken(t);
    setTok(t);
  }, []);
  const signOut = useCallback(() => {
    setToken(null);
    setTok(null);
  }, []);
  const status = !token ? "out" : isPending ? "checking" : data?.ok ? "in" : "out";
  return { status, signIn, signOut };
};

export const useRefreshArticles = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ARTICLES_KEY });
};

export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

export const estimateReadTime = (blocks) => {
  const words = blocks.reduce((n, b) => n + (b.x.trim() ? b.x.trim().split(/\s+/).length : 0), 0);
  return Math.max(1, Math.round(words / 220));
};
