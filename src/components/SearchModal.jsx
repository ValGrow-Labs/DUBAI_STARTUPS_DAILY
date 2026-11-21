import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Building2, FileText, Sparkles, User, Tag } from 'lucide-react';

export default function SearchModal({ 
  isOpen, 
  onClose, 
  articles = [], 
  startups = [], 
  onSelectArticle, 
  onSelectStartup 
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle global escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // will be handled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredArticles = query.trim() ? articles.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category?.toLowerCase().includes(query.toLowerCase()) ||
    (typeof a.author === 'string' && a.author.toLowerCase().includes(query.toLowerCase())) ||
    (a.author?.name && a.author.name.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const filteredStartups = query.trim() ? startups.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase()) ||
    s.founders.some(f => f.toLowerCase().includes(query.toLowerCase())) ||
    s.investors.some(inv => inv.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-obsidian-950/80 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-gold-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all intelligence, companies, founders, or deals..."
            className="w-full bg-transparent text-white dark:text-white light:text-slate-900 text-base placeholder:text-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-xs font-mono">
              <p className="mb-2 uppercase tracking-wider text-slate-500">Popular Quick Queries</p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                {['Tabby', 'Sovereign AI', 'DIFC', 'Qlub', 'Stake', 'Hosam Arab', 'FinTech Sandbox'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 hover:bg-gold-500 hover:text-obsidian-950 transition-colors text-slate-300 dark:text-slate-300 light:text-slate-700"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Startups Result List */}
              {filteredStartups.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 block mb-2">
                    STARTUP DOSSIERS ({filteredStartups.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredStartups.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          onSelectStartup(st);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={st.logo} alt={st.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 group-hover:text-gold-400 transition-colors">
                                {st.name}
                              </h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                                {st.stage}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                              {st.category} • Raised {st.raised} • {st.location}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Result List */}
              {filteredArticles.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-400 px-2 block mb-2">
                    EDITORIAL & SCOOPS ({filteredArticles.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          onSelectArticle(art);
                          onClose();
                        }}
                        className="p-3 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-gold-400 block mb-0.5">
                            {art.category} • {art.readTime}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 group-hover:text-gold-300 transition-colors line-clamp-1">
                            {art.title}
                          </h4>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredStartups.length === 0 && filteredArticles.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No matches found for "{query}". Try a different term or company name.
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 border-t border-white/5 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Search index updated hourly via DSD Terminal</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
}
