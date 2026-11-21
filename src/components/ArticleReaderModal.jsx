import React, { useState } from 'react';
import { 
  X, Bookmark, Share2, Clock, Check, 
  Volume2, Type, ArrowLeft, ArrowRight, Sparkles 
} from 'lucide-react';

export default function ArticleReaderModal({ 
  article, 
  onClose, 
  isBookmarked, 
  onToggleBookmark 
}) {
  const [fontSize, setFontSize] = useState('md'); // 'sm' | 'md' | 'lg'
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-xl animate-fade-in flex justify-center py-6 px-4">
      
      {/* Reader Container */}
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Reader Action Bar */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-obsidian-900/95 dark:bg-obsidian-900/95 light:bg-white/95 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </button>

          {/* Reader Controls: Font sizer, Bookmark, Share, Close */}
          <div className="flex items-center gap-3">
            {/* Font Sizer */}
            <div className="flex items-center rounded-lg bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 border border-white/10 p-1 text-xs font-mono">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 rounded ${fontSize === 'md' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-lg border transition-all ${
                isBookmarked 
                  ? 'bg-gold-500 text-obsidian-950 border-gold-400' 
                  : 'bg-obsidian-850 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Article"}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-obsidian-950' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-obsidian-850 border border-white/10 text-slate-400 hover:text-gold-400 transition-colors relative"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Content Area */}
        <div className="p-6 sm:p-10">
          
          {/* Metadata & Tag */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-gold-500/20 text-gold-400 border border-gold-500/30">
              {article.category || "INTELLIGENCE"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="text-xs text-slate-500 font-mono">• {article.publishedAt || "Today"}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Subtitle / Teaser */}
          {article.subtitle && (
            <p className="mt-4 text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 font-serif italic leading-relaxed">
              "{article.subtitle}"
            </p>
          )}

          {/* Author Card */}
          <div className="my-6 py-4 border-y border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center font-display font-bold text-gold-400">
                {article.author?.name ? article.author.name[0] : (typeof article.author === 'string' ? article.author[0] : 'D')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                  {article.author?.name || article.author || "DSD Editorial Desk"}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {article.author?.role || "Venture Bureau Dubai"}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              VERIFIED SCOOP
            </span>
          </div>

          {/* Featured Image if present */}
          {(article.heroImage || article.image) && (
            <div className="rounded-2xl overflow-hidden mb-8 border border-white/10">
              <img 
                src={article.heroImage || article.image} 
                alt={article.title}
                className="w-full h-64 sm:h-80 object-cover" 
              />
            </div>
          )}

          {/* Strategic Takeaways Box */}
          {article.keyPoints && article.keyPoints.length > 0 && (
            <div className="mb-8 p-5 rounded-2xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-50 border border-gold-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gold-400">
                  Executive Intelligence Takeaways
                </h4>
              </div>
              <ul className="space-y-2">
                {article.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prose Content */}
          <div className={`space-y-5 text-slate-300 dark:text-slate-300 light:text-slate-700 font-sans ${fontClasses[fontSize]}`}>
            {article.content ? (
              article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.trim().startsWith('###')) {
                  return (
                    <h3 key={index} className="font-display font-bold text-xl text-white dark:text-white light:text-slate-900 mt-6 pt-4 border-t border-white/10">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {paragraph.trim()}
                  </p>
                );
              })
            ) : (
              <p>Full article dossier loading from the Dubai Startups Daily archive...</p>
            )}
          </div>

          {/* Article Footer & Disclaimers */}
          <div className="mt-12 pt-6 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <span>Published by Dubai Startups Daily Intelligence Unit</span>
            <span>DIFC Gate Precinct 4, Dubai, UAE</span>
          </div>

        </div>

      </div>
    </div>
  );
}
