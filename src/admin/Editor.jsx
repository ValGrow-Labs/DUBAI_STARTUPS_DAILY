import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Heading2, ImagePlus, Pilcrow, Quote, RefreshCw, Trash2, Upload, X,
} from "lucide-react";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/data/articles";
import { ARTICLES_KEY } from "@/context/ContentContext";
import { estimateReadTime, slugify, useRefreshArticles } from "./useAdmin";

const todayISO = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  title: "",
  slug: "",
  dek: "",
  category: CATEGORIES[0].slug,
  author: "",
  authorRole: "",
  date: todayISO(),
  readTime: 1,
  image: "",
  imageCaption: "",
  tags: [],
  featured: false,
  trending: false,
  blocks: [{ t: "p", x: "" }],
};

const BLOCK_TYPES = [
  { t: "p", label: "Paragraph", Icon: Pilcrow },
  { t: "h", label: "Heading", Icon: Heading2 },
  { t: "q", label: "Quote", Icon: Quote },
];

/* ---------- small field primitives ---------- */
const Label = ({ htmlFor, children, hint }) => (
  <div className="flex items-baseline justify-between gap-3">
    <label htmlFor={htmlFor} className="text-[0.82rem] font-semibold text-ink">{children}</label>
    {hint && <span className="text-[0.75rem] text-muted">{hint}</span>}
  </div>
);
const FieldError = ({ id, msg }) =>
  msg ? <p id={id} role="alert" className="mt-1.5 text-[0.8rem] font-medium text-red-500 dark:text-red-400">{msg}</p> : null;

const inputCls = (err) =>
  `mt-2 w-full rounded-[12px] bg-bg px-3.5 py-2.5 text-[0.92rem] text-ink placeholder:text-muted/70 outline-none ring-1 transition-shadow ${
    err ? "ring-red-500/70" : "ring-line/12 focus:ring-2 focus:ring-ink"
  }`;

const AutoTextarea = ({ value, onChange, className, ...rest }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={`resize-none overflow-hidden ${className}`} {...rest} />;
};

const Toggle = ({ checked, onChange, label, hint }) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 py-2">
    <span>
      <span className="block text-[0.88rem] font-semibold text-ink">{label}</span>
      <span className="block text-[0.78rem] text-muted">{hint}</span>
    </span>
    <span className="relative mt-0.5 shrink-0">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="block h-6 w-10 rounded-full bg-raised ring-1 ring-line/10 transition-colors peer-checked:bg-lime peer-focus-visible:ring-2 peer-focus-visible:ring-acc" />
      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] peer-checked:translate-x-4 peer-checked:bg-onlime" />
    </span>
  </label>
);

/* ---------- block editor ---------- */
const BlockEditor = ({ blocks, setBlocks, error }) => {
  const update = (i, patch) => setBlocks(blocks.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const move = (i, d) => {
    const next = [...blocks];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setBlocks(next);
  };
  const remove = (i) => setBlocks(blocks.length > 1 ? blocks.filter((_, j) => j !== i) : [{ t: "p", x: "" }]);
  const add = (t) => setBlocks([...blocks, { t, x: "" }]);

  // Pasting text with blank lines splits it into separate paragraphs.
  const onPaste = (i, e) => {
    const text = e.clipboardData.getData("text/plain");
    if (!/\n\s*\n/.test(text)) return;
    e.preventDefault();
    const parts = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    const next = [...blocks];
    const current = next[i];
    next.splice(i, 1, { ...current, x: (current.x ? `${current.x} ` : "") + parts[0] }, ...parts.slice(1).map((x) => ({ t: "p", x })));
    setBlocks(next);
  };

  const styles = {
    p: "text-[1.02rem] leading-[1.7] text-body",
    h: "font-display text-[1.35rem] font-bold tracking-[-0.025em] text-ink",
    q: "font-display text-[1.25rem] font-semibold italic leading-snug tracking-[-0.02em] text-ink border-l-2 border-lime pl-4",
  };

  return (
    <div>
      <Label hint="Paste multiple paragraphs to split them automatically">Story body</Label>
      <ol className={`mt-3 space-y-2 ${error ? "rounded-tile ring-1 ring-red-500/60 p-2" : ""}`}>
        {blocks.map((b, i) => (
          <li key={i} className="group relative rounded-tile bg-bg p-3 pl-3 ring-1 ring-line/10 focus-within:ring-2 focus-within:ring-ink transition-shadow">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex gap-1" role="radiogroup" aria-label={`Block ${i + 1} type`}>
                {BLOCK_TYPES.map(({ t, label, Icon }) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={b.t === t}
                    title={label}
                    onClick={() => update(i, { t })}
                    className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[0.72rem] font-semibold transition-colors ${
                      b.t === t ? "bg-ink text-bg" : "text-muted hover:bg-raised hover:text-ink"
                    }`}
                  >
                    <Icon size={12} /> <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-0.5 opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink disabled:opacity-30">
                  <ArrowUp size={13} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="Move down" className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink disabled:opacity-30">
                  <ArrowDown size={13} />
                </button>
                <button type="button" onClick={() => remove(i)} aria-label="Remove block" className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-red-500/10 hover:text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <AutoTextarea
              value={b.x}
              onChange={(e) => update(i, { x: e.target.value })}
              onPaste={(e) => onPaste(i, e)}
              aria-label={`Block ${i + 1}`}
              placeholder={b.t === "h" ? "Section heading" : b.t === "q" ? "A line worth quoting" : "Write…"}
              className={`w-full bg-transparent outline-none placeholder:text-muted/60 ${styles[b.t]}`}
            />
          </li>
        ))}
      </ol>
      <FieldError msg={error} />
      <div className="mt-3 flex flex-wrap gap-2">
        {BLOCK_TYPES.map(({ t, label, Icon }) => (
          <button key={t} type="button" onClick={() => add(t)} className="btn-ghost py-2 px-3.5 text-[0.82rem]">
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------- image field ---------- */
const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("Couldn’t read that file."));
    r.readAsDataURL(file);
  });

const ImageField = ({ value, onChange, error }) => {
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setUploadError("");
    if (!file.type.startsWith("image/")) return setUploadError("Choose an image file.");
    if (file.size > 6 * 1024 * 1024) return setUploadError("Images must be under 6 MB.");
    setBusy(true);
    try {
      const { url } = await api.upload(await readAsDataURL(file));
      onChange(url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label>Cover image</Label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        className={`relative mt-2 aspect-[16/10] overflow-hidden rounded-[14px] bg-bg ring-1 transition-shadow ${
          drag ? "ring-2 ring-lime" : error ? "ring-red-500/70" : "ring-line/12"
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
            <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5">
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-black/60 px-3 text-[0.75rem] font-semibold text-white backdrop-blur hover:bg-black/80">
                <RefreshCw size={12} /> Replace
              </button>
              <button type="button" onClick={() => onChange("")} aria-label="Remove image" className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80">
                <X size={14} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted hover:text-ink transition-colors"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-raised">
              {busy ? <Upload size={18} className="animate-bounce" /> : <ImagePlus size={18} />}
            </span>
            <span className="text-[0.85rem] font-semibold">{busy ? "Uploading…" : "Upload or drop an image"}</span>
            <span className="text-[0.75rem]">JPG, PNG, WebP · up to 6 MB</span>
          </button>
        )}
        {busy && value && <div className="absolute inset-0 grid place-items-center bg-black/40 text-sm font-semibold text-white">Uploading…</div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} tabIndex={-1} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="…or paste an https:// image URL"
        aria-label="Image URL"
        className={`${inputCls(false)} text-[0.82rem]`}
      />
      <FieldError msg={uploadError || error} />
    </div>
  );
};

/* ---------- tags ---------- */
const TagsField = ({ tags, setTags }) => {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim().replace(/,$/, "");
    if (t && !tags.includes(t) && tags.length < 12) setTags([...tags, t]);
    setDraft("");
  };
  return (
    <div>
      <Label htmlFor="tags" hint="Enter to add">Topics</Label>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-[12px] bg-bg p-2 ring-1 ring-line/12 focus-within:ring-2 focus-within:ring-ink">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-raised py-1 pl-2.5 pr-1 text-[0.78rem] font-medium text-ink">
            {t}
            <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="grid h-4 w-4 place-items-center rounded-full hover:bg-ink hover:text-bg">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id="tags"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && tags.length) setTags(tags.slice(0, -1));
          }}
          onBlur={add}
          placeholder={tags.length ? "" : "e.g. Series A, Fintech"}
          className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-[0.85rem] text-ink placeholder:text-muted/70 outline-none"
        />
      </div>
    </div>
  );
};

/* ---------- editor page ---------- */
const Editor = () => {
  const { slug: editingSlug } = useParams();
  const isNew = !editingSlug;
  const navigate = useNavigate();
  const refresh = useRefreshArticles();
  const { data: all = [], isPending } = useQuery({ queryKey: ARTICLES_KEY, queryFn: api.articles, retry: 0 });
  const existing = useMemo(() => all.find((a) => a.slug === editingSlug), [all, editingSlug]);

  const [form, setForm] = useState(null);
  const [initial, setInitial] = useState("");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [readTouched, setReadTouched] = useState(!isNew);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // initialise once data is ready
  if (!form && (isNew || existing)) {
    const start = isNew ? EMPTY : { ...EMPTY, ...existing, tags: existing.tags || [], blocks: existing.blocks?.length ? existing.blocks : EMPTY.blocks };
    setForm(start);
    setInitial(JSON.stringify(start));
  }

  const dirty = form && JSON.stringify(form) !== initial;

  useEffect(() => {
    const warn = (e) => {
      if (dirty && !saving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, saving]);

  const set = (patch) => {
    setForm((f) => {
      const next = { ...f, ...patch };
      if ("title" in patch && !slugTouched) next.slug = slugify(patch.title);
      if ("blocks" in patch && !readTouched) next.readTime = estimateReadTime(patch.blocks);
      return next;
    });
    // clear errors for the fields this edit touched (incl. auto-filled slug / read time)
    const keys = Object.keys(patch);
    if ("title" in patch && !slugTouched) keys.push("slug");
    if ("blocks" in patch && !readTouched) keys.push("readTime");
    if (keys.some((k) => errors[k])) {
      const rest = Object.fromEntries(Object.entries(errors).filter(([k]) => !keys.includes(k)));
      setErrors(rest);
      if (!Object.keys(rest).length) setFormError("");
    }
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, readTime: Number(form.readTime) };
      const saved = isNew ? await api.create(payload) : await api.update(editingSlug, payload);
      await refresh();
      setInitial(JSON.stringify(form));
      navigate("/admin", { state: { notice: `${isNew ? "Published" : "Saved"} “${saved.title}”.` } });
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
      if (err.status === 401) navigate("/admin", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S saves
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!isNew && !isPending && !existing) {
    return (
      <div className="wrap py-20">
        <h1 className="display text-[2.4rem]">Story not found</h1>
        <p className="mt-2 text-muted">It may have been deleted or renamed.</p>
        <Link to="/admin" className="btn-lime mt-6"><ArrowLeft size={16} /> All stories</Link>
      </div>
    );
  }
  if (!form) return <div className="wrap py-20"><div className="h-10 w-1/2 rounded-card bg-raised animate-pulse" /></div>;

  const words = form.blocks.reduce((n, b) => n + (b.x.trim() ? b.x.trim().split(/\s+/).length : 0), 0);

  return (
    <div className="wrap py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-[0.85rem] text-muted hover:text-ink transition-colors">
          <ArrowLeft size={15} /> All stories
        </Link>
        <div className="flex items-center gap-3 text-[0.8rem] text-muted">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${dirty ? "bg-amber-400" : "bg-lime"}`} />
            {dirty ? "Unsaved changes" : isNew ? "New draft" : "All changes saved"}
          </span>
          {!isNew && (
            <a href={`/article/${editingSlug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-ink hover:text-acc">
              View live <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>

      {formError && (
        <div role="alert" className="mt-6 rounded-card bg-red-500/10 px-4 py-3 text-[0.9rem] text-red-600 dark:text-red-400 ring-1 ring-red-500/30 rise">
          {formError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        noValidate
        className="mt-6 grid gap-8 lg:grid-cols-12"
      >
        {/* Main column */}
        <div className="lg:col-span-8 space-y-7">
          <div>
            <label htmlFor="title" className="sr-only">Headline</label>
            <AutoTextarea
              id="title"
              value={form.title}
              onChange={(e) => set({ title: e.target.value.replace(/\n/g, " ") })}
              placeholder="Headline"
              aria-invalid={!!errors.title}
              className={`w-full bg-transparent font-display text-[2.2rem] sm:text-[2.8rem] font-bold leading-[1] tracking-[-0.035em] text-ink placeholder:text-muted/40 outline-none ${errors.title ? "underline decoration-red-500 decoration-2 underline-offset-8" : ""}`}
            />
            <FieldError msg={errors.title} />
          </div>

          <div>
            <Label htmlFor="dek" hint={`${form.dek.length}/400`}>Summary</Label>
            <AutoTextarea
              id="dek"
              value={form.dek}
              onChange={(e) => set({ dek: e.target.value })}
              placeholder="One or two sentences that sell the story."
              aria-invalid={!!errors.dek}
              className={`${inputCls(errors.dek)} text-[1.02rem] leading-relaxed`}
            />
            <FieldError msg={errors.dek} />
          </div>

          <BlockEditor blocks={form.blocks} setBlocks={(blocks) => set({ blocks })} error={errors.blocks} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10">
              <button type="submit" disabled={saving} className="btn-lime w-full disabled:opacity-60" data-testid="admin-save">
                {saving ? "Saving…" : isNew ? "Publish story" : "Save changes"}
              </button>
              <p className="mt-2.5 text-center text-[0.75rem] text-muted">
                {words} words · <kbd className="font-mono">Ctrl</kbd>+<kbd className="font-mono">S</kbd> to save
              </p>
            </div>

            <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10 space-y-4">
              <div>
                <Label htmlFor="category">Section</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set({ category: e.target.value })}
                  className={`${inputCls(errors.category)} appearance-none bg-[length:12px] bg-[right_0.9rem_center] bg-no-repeat pr-9`}
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%23888' stroke-width='1.6'/%3E%3C/svg%3E\")" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <FieldError msg={errors.category} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <input id="author" value={form.author} onChange={(e) => set({ author: e.target.value })} className={inputCls(errors.author)} />
                  <FieldError msg={errors.author} />
                </div>
                <div>
                  <Label htmlFor="authorRole">Role</Label>
                  <input id="authorRole" value={form.authorRole} onChange={(e) => set({ authorRole: e.target.value })} placeholder="Reporter" className={inputCls(errors.authorRole)} />
                  <FieldError msg={errors.authorRole} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <input id="date" type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} className={`${inputCls(errors.date)} [color-scheme:inherit]`} />
                  <FieldError msg={errors.date} />
                </div>
                <div>
                  <Label htmlFor="readTime" hint={readTouched ? (
                    <button type="button" onClick={() => { setReadTouched(false); set({ readTime: estimateReadTime(form.blocks) }); }} className="font-semibold text-acc hover:underline">Auto</button>
                  ) : "auto"}>Read time</Label>
                  <div className="relative">
                    <input
                      id="readTime"
                      type="number"
                      min={1}
                      max={60}
                      value={form.readTime}
                      onChange={(e) => {
                        setReadTouched(true);
                        set({ readTime: e.target.value });
                      }}
                      className={`${inputCls(errors.readTime)} pr-12`}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 mt-1 -translate-y-1/2 text-[0.8rem] text-muted">min</span>
                  </div>
                  <FieldError msg={errors.readTime} />
                </div>
              </div>
              <div>
                <Label htmlFor="slug" hint={!slugTouched ? "from headline" : null}>URL slug</Label>
                <div className={`${inputCls(errors.slug)} flex items-center gap-0 !py-0 pr-1`}>
                  <span className="shrink-0 text-[0.8rem] text-muted">/article/</span>
                  <input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set({ slug: slugify(e.target.value) || e.target.value.toLowerCase() });
                    }}
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.88rem] text-ink outline-none"
                  />
                </div>
                <FieldError msg={errors.slug} />
                {!isNew && form.slug !== editingSlug && (
                  <p className="mt-1.5 text-[0.75rem] text-amber-600 dark:text-amber-400">Changing the slug breaks links already shared.</p>
                )}
              </div>
            </div>

            <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10 space-y-4">
              <ImageField value={form.image} onChange={(image) => set({ image })} error={errors.image} />
              <div>
                <Label htmlFor="caption">Caption</Label>
                <input id="caption" value={form.imageCaption} onChange={(e) => set({ imageCaption: e.target.value })} placeholder="Describe the image" className={inputCls(false)} />
              </div>
            </div>

            <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10 space-y-2">
              <TagsField tags={form.tags} setTags={(tags) => set({ tags })} />
              <div className="pt-2 divide-y divide-line/10">
                <Toggle checked={form.featured} onChange={(featured) => set({ featured })} label="Lead story" hint="Shows as the big story on the home page. Replaces the current lead." />
                <Toggle checked={form.trending} onChange={(trending) => set({ trending })} label="Most read" hint="Pins it to the Most read list." />
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Editor;
