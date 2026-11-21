import React from 'react';
import { TrendingUp, Rocket, Award, Zap, ArrowUpRight } from 'lucide-react';

export default function EcosystemStats({ stats = [] }) {
  const iconMap = {
    TrendingUp: TrendingUp,
    Rocket: Rocket,
    Award: Award,
    Zap: Zap,
  };

  return (
    <section className="py-6 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, idx) => {
            const Icon = iconMap[item.icon] || TrendingUp;
            return (
              <div 
                key={idx}
                className="relative overflow-hidden rounded-2xl p-5 border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-900/80 dark:bg-obsidian-900/80 light:bg-white backdrop-blur-md shadow-card-dark transition-all duration-300 hover:border-gold-500/30 group"
              >
                {/* Background ambient glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors"></div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="p-2 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/5 dark:border-white/5 light:border-slate-200 text-gold-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-white dark:text-white light:text-slate-900 tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
                    {item.change}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{item.subtext}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
