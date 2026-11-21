import React, { useState } from 'react';
import { 
  Flame, Clock, ArrowRight, Play, Pause, Bookmark, 
  Volume2, Share2, Sparkles, TrendingUp, CheckCircle 
} from 'lucide-react';

export default function HeroBento({ 
  heroArticle, 
  trendingArticles, 
  onSelectArticle, 
  bookmarkedIds = [], 
  onToggleBookmark 
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(38);

  const isHeroBookmarked = bookmarkedIds.includes(heroArticle.id);

  return (
    <section id="editorial" className="py-8 lg:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading Tag */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-gold-400 rounded-sm transform rotate-45"></span>
            <h2 className="font-display font-bold text-sm tracking-wider uppercase text-slate-300 dark:text-slate-300 light:text-slate-700">
              Frontier Dossier & Breaking Intelligence
            </h2>
          </div>
          <span className="text-xs font-mono text-gold-400/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            CURATED FOR VENTURE PARTNERS & FOUNDERS
          </span>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Lead Feature Card (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl overflow-hidden relative group border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-900 dark:bg-obsidian-900 light:bg-white shadow-card-dark transition-all duration-300 hover:border-gold-500/40">
            
            {/* Background Image Container with Gradient Overlay */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img 
                src={heroArticle.heroImage} 
                alt={heroArticle.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent dark:from-obsidian-950 dark:via-obsidian-950/60 light:from-white light:via-white/50"></div>
              
              {/* Badges on top of hero image */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-gold-500 text-obsidian-950 shadow-gold-glow flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-obsidian-950" />
                  {heroArticle.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide bg-obsidian-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  {heroArticle.category}
                </span>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(heroArticle);
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all z-10 ${
                  isHeroBookmarked 
                    ? 'bg-gold-500 text-obsidian-950 border-gold-400' 
                    : 'bg-obsidian-950/80 text-white/80 border-white/20 hover:text-gold-400 hover:border-gold-400/50'
                }`}
                title={isHeroBookmarked ? "Remove Bookmark" : "Bookmark Story"}
              >
                <Bookmark className={`w-4 h-4 ${isHeroBookmarked ? 'fill-obsidian-950' : ''}`} />
              </button>

              {/* Audio Listen Dispatch Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-obsidian-900/90 dark:bg-obsidian-900/90 light:bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 flex items-center justify-center transition-all shadow-gold-glow shrink-0"
                    title={isPlayingAudio ? "Pause Audio Brief" : "Listen to Audio Brief (4 min)"}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-obsidian-950" /> : <Play className="w-4 h-4 fill-obsidian-950 translate-x-0.5" />}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                      Listen to Executive Audio Dispatch ({heroArticle.audioLength})
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isPlayingAudio ? 'Playing AI narration • 128kbps HQ' : 'Generated by DSD Sovereign Voice Engine'}
                    </span>
                  </div>
                </div>

                {/* Animated Audio Waveform */}
                <div className="hidden sm:flex items-center gap-1 h-5 px-3">
                  {[40, 75, 20, 90, 60, 30, 85, 45, 100, 70, 50, 80, 35, 95].map((h, i) => (
                    <span 
                      key={i} 
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio 
                          ? 'bg-gold-400 animate-pulse' 
                          : 'bg-slate-600'
                      }`}
                      style={{ 
                        height: isPlayingAudio ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                        animationDelay: `${i * 80}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <h3 
                  onClick={() => onSelectArticle(heroArticle)}
                  className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white dark:text-white light:text-slate-900 group-hover:text-gold-300 transition-colors cursor-pointer"
                >
                  {heroArticle.title}
                </h3>
                <p className="mt-4 text-slate-300 dark:text-slate-300 light:text-slate-600 text-sm sm:text-base leading-relaxed">
                  {heroArticle.subtitle}
                </p>

                {/* Key Takeaways Snapshot */}
                <div className="mt-5 p-4 rounded-xl bg-obsidian-850/80 dark:bg-obsidian-850/80 light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Key Strategic Takeaway
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 font-sans italic">
                    "{heroArticle.keyPoints[0]}"
                  </p>
                </div>
              </div>

              {/* Author & Footer Meta */}
              <div className="mt-6 pt-5 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={heroArticle.author.avatar} 
                    alt={heroArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-gold-500/50" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                      {heroArticle.author.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">
                      {heroArticle.author.role} • {heroArticle.publishedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    {heroArticle.readTime}
                  </span>
                  
                  <button
                    onClick={() => onSelectArticle(heroArticle)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-gold-500 hover:text-obsidian-950 text-white transition-all group/btn"
                  >
                    <span>Read Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trending Velocity Stack (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            <div className="p-4 rounded-xl bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-white dark:text-white light:text-slate-900">
                  Trending Dealflow
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                LIVE VELOCITY
              </span>
            </div>

            {/* List of Trending Stories */}
            <div className="flex flex-col gap-3 flex-1">
              {trendingArticles.map((article) => {
                const isBookmarked = bookmarkedIds.includes(article.id);
                return (
                  <div 
                    key={article.id}
                    onClick={() => onSelectArticle(article)}
                    className="p-4 rounded-xl bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border border-white/5 hover:border-gold-500/40 dark:border-white/5 light:border-slate-200 transition-all cursor-pointer group flex gap-3 relative"
                  >
                    {/* Rank Number */}
                    <span className="font-mono font-black text-2xl text-slate-600 dark:text-slate-600 light:text-slate-300 group-hover:text-gold-400 transition-colors shrink-0">
                      {article.rank}
                    </span>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-gold-400">
                            {article.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 light:text-slate-400">
                            {article.reads} reads
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-200 dark:text-slate-200 light:text-slate-900 group-hover:text-gold-300 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-100">
                        <span>{article.author}</span>
                        <div className="flex items-center gap-2">
                          <span>{article.readTime}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(article);
                            }}
                            className="text-slate-400 hover:text-gold-400 transition-colors"
                            title="Bookmark"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-gold-400 text-gold-400' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Briefing Teaser */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 dark:from-obsidian-850 dark:to-obsidian-900 light:from-slate-100 light:to-white border border-gold-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-gold-400 font-bold block">
                  MORNING SYNDICATE
                </span>
                <span className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                  Download Today's Dealflow Sheet (PDF)
                </span>
              </div>
              <a 
                href="#newsletter"
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-gold-500 text-obsidian-950 hover:bg-gold-400 transition-all shrink-0"
              >
                Access
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
