import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Clock } from 'lucide-react';

export default function BookmarksDrawer({ 
  isOpen, 
  onClose, 
  bookmarkedArticles = [], 
  onSelectArticle, 
  onRemoveBookmark, 
  onClearAll 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-md h-full bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border-l border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-gold-400 fill-gold-400" />
            <div>
              <h3 className="font-display font-bold text-lg text-white dark:text-white light:text-slate-900">
                Reading Vault
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {bookmarkedArticles.length} {bookmarkedArticles.length === 1 ? 'Article' : 'Articles'} Saved for Offline
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {bookmarkedArticles.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Your Reading Vault is empty.</p>
              <p className="text-xs text-slate-500 mt-1">
                Bookmark articles across Dubai Startups Daily to read later at your convenience.
              </p>
            </div>
          ) : (
            bookmarkedArticles.map((art) => (
              <div
                key={art.id}
                className="p-4 rounded-2xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200 flex flex-col justify-between gap-3 group relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-gold-400">
                      {art.category || "FEATURE"}
                    </span>
                    <button
                      onClick={() => onRemoveBookmark(art.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-900 group-hover:text-gold-300 transition-colors cursor-pointer leading-snug"
                  >
                    {art.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-400" />
                    {art.readTime}
                  </span>

                  <button
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="text-gold-400 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedArticles.length > 0 && (
          <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear Reading Vault
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
