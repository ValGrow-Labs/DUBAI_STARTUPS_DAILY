import React, { useState } from 'react';
import { 
  Play, Pause, Mic, Radio, Volume2, SkipForward, 
  Clock, Share2, Headphones, Disc3 
} from 'lucide-react';

export default function PodcastLounge({ episodes = [] }) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(14); // in minutes

  const activeEpisode = episodes[currentEpisodeIndex] || episodes[0];

  const togglePlay = (index) => {
    if (currentEpisodeIndex === index) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
      setPlaybackTime(0);
    }
  };

  return (
    <section id="podcasts" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm transform rotate-45"></span>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 block">
                AUDIO TRANSMISSIONS
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white dark:text-white light:text-slate-900 tracking-tight">
                The Founders Lounge
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            EPISODE {activeEpisode.episode} ON AIR
          </span>
        </div>

        {/* Player Container */}
        <div className="rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-900/90 dark:bg-obsidian-900/90 light:bg-white backdrop-blur-xl shadow-card-dark overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Active Player Deck (Col 1-7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 dark:border-white/10 light:border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  {activeEpisode.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{activeEpisode.episode}</span>
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-white dark:text-white light:text-slate-900 leading-snug">
                {activeEpisode.title}
              </h3>

              <div className="mt-4 flex items-center gap-3">
                <img 
                  src={activeEpisode.cover} 
                  alt={activeEpisode.guest}
                  className="w-12 h-12 rounded-xl object-cover border border-gold-500/40" 
                />
                <div>
                  <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                    {activeEpisode.guest}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeEpisode.guestTitle}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed italic">
                "{activeEpisode.synopsis}"
              </p>
            </div>

            {/* Interactive Player Controls */}
            <div className="mt-8 pt-6 border-t border-white/10 dark:border-white/10 light:border-slate-200 space-y-4">
              
              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-200 rounded-full overflow-hidden cursor-pointer">
                  <div 
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-300"
                    style={{ width: isPlaying ? '55%' : '25%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{isPlaying ? '18:42' : '04:15'}</span>
                  <span>{activeEpisode.duration}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlay(currentEpisodeIndex)}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 flex items-center justify-center hover:scale-105 transition-all shadow-gold-glow"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-obsidian-950" /> : <Play className="w-5 h-5 fill-obsidian-950 translate-x-0.5" />}
                  </button>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                      {isPlaying ? 'Streaming Episode Audio' : 'Ready to Stream'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Apple Podcasts • Spotify • YouTube Music
                    </span>
                  </div>
                </div>

                {/* Animated Equalizer Visualizer */}
                <div className="flex items-end gap-1 h-6">
                  {[30, 80, 45, 95, 60, 25, 90, 70, 40].map((val, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-gold-400 animate-pulse' : 'bg-slate-700'}`}
                      style={{ 
                        height: isPlaying ? `${val}%` : '20%',
                        animationDelay: `${i * 100}ms`
                      }}
                    ></span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Episode Playlist Sidebar (Col 8-12) */}
          <div className="lg:col-span-5 p-6 bg-obsidian-850/60 dark:bg-obsidian-850/60 light:bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-4">
                RECENT CONVERSATIONS
              </span>

              <div className="space-y-3">
                {episodes.map((ep, idx) => {
                  const isCurrent = currentEpisodeIndex === idx;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => togglePlay(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-obsidian-800 dark:bg-obsidian-800 light:bg-white border-gold-500/50 shadow-gold-glow' 
                          : 'bg-obsidian-900/40 dark:bg-obsidian-900/40 light:bg-white/80 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isCurrent && isPlaying ? 'bg-gold-500 text-obsidian-950' : 'bg-white/10 text-slate-300'
                        }`}>
                          {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gold-400 block">{ep.episode} • {ep.guest}</span>
                          <h5 className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 line-clamp-1">
                            {ep.title}
                          </h5>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {ep.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Subscribe on RSS feed</span>
              <a href="#newsletter" className="text-gold-400 hover:underline">Get Notified →</a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
