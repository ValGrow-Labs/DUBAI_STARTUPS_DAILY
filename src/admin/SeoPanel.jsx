import { useState } from "react";
import { Globe, AlertTriangle, ChevronDown, ChevronUp, Eye } from "lucide-react";

/**
 * Live Google Search Snippet & Social Share Preview + SEO Controls for CMS Editor
 */
const SeoPanel = ({ form, set, _errors = {} }) => {
  const [open, setOpen] = useState(true);
  const [previewTab, setPreviewTab] = useState("google"); // "google" | "social"

  const effectiveTitle = form.seoTitle?.trim() || form.title?.trim() || "Headline of the Story";
  const effectiveDesc =
    form.metaDescription?.trim() ||
    form.dek?.trim() ||
    "Add a one- or two-sentence summary to appear in Google search results and social cards.";
  const effectiveSlug = form.slug?.trim() || "article-slug";
  const effectiveImage = form.ogImage?.trim() || form.image?.trim() || "";

  // Title character guidance (optimal 45-60)
  const titleLen = effectiveTitle.length;
  const titleColor =
    titleLen === 0
      ? "text-muted"
      : titleLen >= 40 && titleLen <= 65
      ? "text-emerald-500"
      : titleLen > 65
      ? "text-amber-500"
      : "text-muted";

  // Description character guidance (optimal 130-160)
  const descLen = effectiveDesc.length;
  const descColor =
    descLen === 0
      ? "text-muted"
      : descLen >= 120 && descLen <= 165
      ? "text-emerald-500"
      : descLen > 165
      ? "text-amber-500"
      : "text-muted";

  // SEO Score / Warnings
  const warnings = [];
  if (!form.seoTitle && !form.title) warnings.push("Add a headline for search engines");
  if (!form.metaDescription && !form.dek) warnings.push("Add a meta description or summary");
  if (!form.focusKeyword) warnings.push("Specify a primary focus keyword");
  if (form.image && !form.imageAlt) warnings.push("Add image alt text for accessibility and image search");
  if (form.canonicalUrl && !form.canonicalUrl.startsWith("http")) warnings.push("Canonical URL should begin with https://");

  const inputCls = (err) =>
    `mt-1.5 w-full rounded-[10px] bg-bg px-3 py-2 text-[0.88rem] text-ink placeholder:text-muted/60 outline-none ring-1 transition-shadow ${
      err ? "ring-red-500/70" : "ring-line/12 focus:ring-2 focus:ring-ink"
    }`;

  return (
    <div className="rounded-tile bg-surface p-5 ring-1 ring-line/10 space-y-4">
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between border-b hairline pb-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-left font-display text-[1.1rem] font-bold text-ink hover:text-acc transition-colors"
        >
          <Globe size={18} className="text-acc" />
          <span>Search Engine Optimization (SEO)</span>
          {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </button>
        <span
          className={`font-mono text-[0.72rem] px-2 py-0.5 rounded-full ${
            warnings.length === 0 ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
          }`}
        >
          {warnings.length === 0 ? "Optimal" : `${warnings.length} suggestions`}
        </span>
      </div>

      {open && (
        <div className="space-y-5 pt-1">
          {/* Preview Mode Switcher */}
          <div className="flex items-center gap-2 border-b hairline pb-3">
            <span className="text-[0.75rem] text-muted flex items-center gap-1">
              <Eye size={13} /> Live Preview:
            </span>
            <button
              type="button"
              onClick={() => setPreviewTab("google")}
              className={`rounded-full px-2.5 py-0.5 text-[0.76rem] font-medium transition-colors ${
                previewTab === "google" ? "bg-raised font-bold text-ink ring-1 ring-line/20" : "text-muted hover:text-ink"
              }`}
            >
              Google Search
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("social")}
              className={`rounded-full px-2.5 py-0.5 text-[0.76rem] font-medium transition-colors ${
                previewTab === "social" ? "bg-raised font-bold text-ink ring-1 ring-line/20" : "text-muted hover:text-ink"
              }`}
            >
              Social Card (OG)
            </button>
          </div>

          {/* Live Preview Box */}
          {previewTab === "google" ? (
            <div className="rounded-[10px] bg-bg p-4 ring-1 ring-line/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[0.75rem] text-muted truncate">
                <span className="font-semibold text-ink">dubaistartupsdaily.ae</span>
                <span>› article › {effectiveSlug}</span>
              </div>
              <p className="font-sans text-[1.05rem] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                {effectiveTitle} · Dubai Startups Daily
              </p>
              <p className="text-[0.82rem] leading-snug text-muted line-clamp-2">
                {effectiveDesc}
              </p>
            </div>
          ) : (
            <div className="rounded-[10px] bg-bg overflow-hidden ring-1 ring-line/10">
              {effectiveImage ? (
                <div className="aspect-[16/9] w-full bg-raised overflow-hidden">
                  <img src={effectiveImage} alt="Social Card Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-raised flex items-center justify-center text-muted text-[0.8rem]">
                  No cover image uploaded
                </div>
              )}
              <div className="p-3">
                <span className="font-mono text-[0.68rem] uppercase text-muted">dubaistartupsdaily.ae</span>
                <p className="font-display text-[0.95rem] font-bold text-ink leading-tight mt-0.5 truncate">
                  {form.ogTitle || effectiveTitle}
                </p>
                <p className="text-[0.78rem] text-muted line-clamp-1 mt-1">
                  {form.ogDescription || effectiveDesc}
                </p>
              </div>
            </div>
          )}

          {/* Warnings / Guidance */}
          {warnings.length > 0 && (
            <div className="rounded-[8px] bg-amber-500/10 p-3 text-[0.78rem] text-amber-600 dark:text-amber-400 space-y-1">
              {warnings.map((w, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Form Controls */}
          <div className="space-y-3.5 text-[0.82rem]">
            {/* Focus Keyword */}
            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-ink">Primary Focus Keyword</label>
                <span className="text-[0.72rem] text-muted">Target search phrase</span>
              </div>
              <input
                value={form.focusKeyword || ""}
                onChange={(e) => set({ focusKeyword: e.target.value })}
                placeholder="e.g. Dubai fintech funding, DIFC startups"
                className={inputCls(false)}
              />
            </div>

            {/* Secondary Keywords */}
            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-ink">Secondary Keywords</label>
                <span className="text-[0.72rem] text-muted">Comma-separated</span>
              </div>
              <input
                value={
                  Array.isArray(form.secondaryKeywords)
                    ? form.secondaryKeywords.join(", ")
                    : form.secondaryKeywords || ""
                }
                onChange={(e) => set({ secondaryKeywords: e.target.value })}
                placeholder="e.g. Series B UAE, Dubai venture capital, payments"
                className={inputCls(false)}
              />
            </div>

            {/* SEO Title Override */}
            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-ink">SEO Title (Overrides Headline)</label>
                <span className={`text-[0.72rem] font-mono ${titleColor}`}>
                  {titleLen} / 60 chars
                </span>
              </div>
              <input
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value })}
                placeholder="Leave blank to use article headline"
                className={inputCls(false)}
              />
            </div>

            {/* Meta Description Override */}
            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-ink">Meta Description (Overrides Dek)</label>
                <span className={`text-[0.72rem] font-mono ${descColor}`}>
                  {descLen} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={form.metaDescription || ""}
                onChange={(e) => set({ metaDescription: e.target.value })}
                placeholder="Leave blank to use story summary"
                className={`${inputCls(false)} resize-none`}
              />
            </div>

            {/* Image Alt Text */}
            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-ink">Image Alt Text (Accessibility & Image SEO)</label>
                <span className="text-[0.72rem] text-muted">Describes image content</span>
              </div>
              <input
                value={form.imageAlt || ""}
                onChange={(e) => set({ imageAlt: e.target.value })}
                placeholder="Descriptive sentence for Google Images and screen readers"
                className={inputCls(false)}
              />
            </div>

            {/* Canonical URL Override */}
            <div>
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-ink">Canonical URL Override</label>
                <span className="text-[0.72rem] text-muted">Default is self-canonical</span>
              </div>
              <input
                value={form.canonicalUrl || ""}
                onChange={(e) => set({ canonicalUrl: e.target.value })}
                placeholder="https://dubaistartupsdaily.ae/article/..."
                className={inputCls(false)}
              />
            </div>

            {/* Robots Index / Follow Toggles */}
            <div className="pt-2 border-t hairline flex items-center justify-between text-[0.8rem]">
              <label className="flex items-center gap-2 cursor-pointer text-ink">
                <input
                  type="checkbox"
                  checked={form.robotsIndex !== false}
                  onChange={(e) => set({ robotsIndex: e.target.checked })}
                  className="rounded"
                />
                <span>Index in Google (index)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-ink">
                <input
                  type="checkbox"
                  checked={form.robotsFollow !== false}
                  onChange={(e) => set({ robotsFollow: e.target.checked })}
                  className="rounded"
                />
                <span>Follow Links (follow)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoPanel;
