import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FileText, Pencil, Plus, Search, Star, Trash2, TrendingUp, X } from "lucide-react";
import { api } from "@/lib/api";
import { CATEGORIES, getCategory, formatDate } from "@/data/articles";
import { ARTICLES_KEY } from "@/context/ContentContext";
import { useRefreshArticles } from "./useAdmin";

const Row = ({ a, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const cat = getCategory(a.category);

  const del = async () => {
    setBusy(true);
    try {
      await onDelete(a);
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <li className="group grid grid-cols-[4rem_1fr_auto] md:grid-cols-[4.5rem_1fr_9rem_7.5rem_auto] items-center gap-4 border-b hairline px-3 py-3 transition-colors hover:bg-ink/[0.025]">
      <div className="h-12 w-16 md:w-[4.5rem] overflow-hidden rounded-[10px] bg-raised">
        {a.image && <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => navigate(`/admin/edit/${a.slug}`)}
          className="block max-w-full truncate text-left font-display text-[1rem] font-bold tracking-[-0.02em] text-ink hover:text-acc transition-colors"
        >
          {a.title}
        </button>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.78rem] text-muted">
          <span>{a.author}</span>
          <span className="md:hidden">· {cat?.short}</span>
          {a.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2 py-px text-[0.68rem] font-semibold text-onlime">
              <Star size={10} fill="currentColor" /> Lead story
            </span>
          )}
          {a.trending && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-px text-[0.68rem] font-semibold text-ink ring-1 ring-line/15">
              <TrendingUp size={10} /> Most read
            </span>
          )}
        </div>
      </div>
      <span className="hidden md:block chip-ghost justify-self-start">{cat?.short}</span>
      <span className="hidden md:block meta">{formatDate(a.date)}</span>

      <div className="flex items-center justify-end gap-1">
        {confirming ? (
          <span className="flex items-center gap-1.5 rise">
            <span className="hidden sm:inline text-[0.8rem] text-muted">Delete?</span>
            <button
              type="button"
              onClick={del}
              disabled={busy}
              className="rounded-full bg-red-500 px-3 py-1.5 text-[0.78rem] font-semibold text-white hover:bg-red-600 disabled:opacity-60"
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} aria-label="Cancel" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink">
              <X size={15} />
            </button>
          </span>
        ) : (
          <>
            <a
              href={`/article/${a.slug}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`View “${a.title}” on the site`}
              className="hidden sm:grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink"
            >
              <ArrowUpRight size={15} />
            </a>
            <Link
              to={`/admin/edit/${a.slug}`}
              aria-label={`Edit “${a.title}”`}
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink"
            >
              <Pencil size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Delete “${a.title}”`}
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </li>
  );
};

const SkeletonRows = () =>
  Array.from({ length: 6 }).map((_, i) => (
    <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b hairline px-3 py-3">
      <div className="h-12 rounded-[10px] bg-raised animate-pulse" />
      <div className="space-y-2 py-1">
        <div className="h-3.5 w-2/3 rounded bg-raised animate-pulse" />
        <div className="h-3 w-1/4 rounded bg-raised animate-pulse" />
      </div>
    </li>
  ));

const Dashboard = () => {
  const { state } = useLocation();
  const refresh = useRefreshArticles();
  const { data = [], isPending, error } = useQuery({ queryKey: ARTICLES_KEY, queryFn: api.articles, retry: 0 });
  const [q, setQ] = useState("");
  const [section, setSection] = useState("all");
  const [notice, setNotice] = useState(state?.notice || "");
  const [actionError, setActionError] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter(
      (a) =>
        (section === "all" || a.category === section) &&
        (!term || `${a.title} ${a.author} ${(a.tags || []).join(" ")}`.toLowerCase().includes(term))
    );
  }, [data, q, section]);

  const counts = useMemo(() => {
    const c = {};
    data.forEach((a) => (c[a.category] = (c[a.category] || 0) + 1));
    return c;
  }, [data]);

  const onDelete = async (a) => {
    setActionError("");
    try {
      await api.remove(a.slug);
      setNotice(`Deleted “${a.title}”.`);
      await refresh();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const lead = data.find((a) => a.featured);

  return (
    <div className="wrap py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display mt-2 text-[2.6rem] sm:text-[3.4rem] leading-[0.92]">
            Stories <span className="text-muted/60 tabular-nums">{data.length || ""}</span>
          </h1>
        </div>
        <Link to="/admin/new" className="btn-lime group" data-testid="admin-new">
          <Plus size={17} className="transition-transform group-hover:rotate-90" /> New story
        </Link>
      </div>

      {notice && (
        <div role="status" className="mt-6 flex items-center justify-between gap-4 rounded-card bg-lime/15 px-4 py-3 text-[0.9rem] text-ink ring-1 ring-lime/40 rise">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss" className="text-muted hover:text-ink"><X size={15} /></button>
        </div>
      )}
      {(actionError || error) && (
        <div role="alert" className="mt-6 rounded-card bg-red-500/10 px-4 py-3 text-[0.9rem] text-red-600 dark:text-red-400 ring-1 ring-red-500/30">
          {actionError || error.message}
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10">
          <p className="eyebrow">Published</p>
          <p className="display mt-3 text-[2.4rem] leading-none tabular-nums">{data.length}</p>
        </div>
        <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10">
          <p className="eyebrow">Sections</p>
          <p className="display mt-3 text-[2.4rem] leading-none tabular-nums">{Object.keys(counts).length}<span className="text-muted/50">/{CATEGORIES.length}</span></p>
        </div>
        <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10 min-w-0">
          <p className="eyebrow">Lead story on home</p>
          {lead ? (
            <Link to={`/admin/edit/${lead.slug}`} className="mt-3 block font-display text-[1.05rem] font-bold leading-snug tracking-[-0.02em] text-ink line-clamp-2 hover:text-acc">
              {lead.title}
            </Link>
          ) : (
            <p className="mt-3 text-[0.9rem] text-muted">None set. The newest story leads.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{ slug: "all", short: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSection(c.slug)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.84rem] font-semibold transition-colors ${
                section === c.slug ? "bg-ink text-bg" : "bg-surface text-body ring-1 ring-line/10 hover:text-ink"
              }`}
            >
              {c.short}
              <span className="ml-1.5 tabular-nums opacity-60">{c.slug === "all" ? data.length : counts[c.slug] || 0}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:w-72">
          <span className="sr-only">Search stories</span>
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, author, tag" className="field py-2.5 pl-10 text-[0.9rem]" />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-tile bg-surface ring-1 ring-line/10">
        <div className="hidden md:grid grid-cols-[4.5rem_1fr_9rem_7.5rem_6.5rem] gap-4 border-b hairline px-3 py-2.5 eyebrow">
          <span />
          <span>Story</span>
          <span>Section</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>
        <ul>
          {isPending ? (
            <SkeletonRows />
          ) : filtered.length ? (
            filtered.map((a) => <Row key={a.slug} a={a} onDelete={onDelete} />)
          ) : (
            <li className="px-6 py-16 text-center">
              <FileText size={28} className="mx-auto text-muted/60" />
              <p className="mt-3 font-display text-[1.2rem] font-bold text-ink">
                {data.length ? "No stories match." : "No stories yet."}
              </p>
              <p className="mt-1 text-[0.9rem] text-muted">
                {data.length ? "Try a different search or section." : "Write the first one."}
              </p>
              {!data.length && (
                <Link to="/admin/new" className="btn-lime mt-5">
                  <Plus size={16} /> New story
                </Link>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
