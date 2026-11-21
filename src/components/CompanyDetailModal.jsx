import React from 'react';
import { 
  X, MapPin, DollarSign, Users, ExternalLink, 
  Calendar, ShieldCheck, Sparkles, Building, Briefcase 
} from 'lucide-react';

export default function CompanyDetailModal({ startup, onClose, onOpenSubmit }) {
  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-obsidian-850 via-obsidian-900 to-obsidian-950 dark:from-obsidian-850 dark:to-obsidian-950 light:from-slate-100 light:to-white border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img 
              src={startup.logo} 
              alt={startup.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-gold-500/40 shadow-gold-glow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-2xl text-white dark:text-white light:text-slate-900">
                  {startup.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-gold-500/20 text-gold-400 border border-gold-500/40">
                  {startup.stage}
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {startup.category} • HQ in {startup.location}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Tagline */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Mission & Product</h4>
            <p className="text-base text-slate-200 dark:text-slate-200 light:text-slate-800 font-medium">
              {startup.tagline}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
            <h4 className="text-xs font-mono uppercase text-gold-400 mb-2">Company Overview</h4>
            <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed text-xs sm:text-sm">
              {startup.description}
            </p>
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-50 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Capital Raised</span>
              <strong className="text-emerald-400 text-lg font-mono">{startup.raised}</strong>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-50 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Latest Valuation</span>
              <strong className="text-white dark:text-white light:text-slate-900 text-lg font-mono">{startup.valuation}</strong>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-50 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Founded Year</span>
              <strong className="text-gold-400 text-lg font-mono">{startup.founded}</strong>
            </div>
          </div>

          {/* Founders */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Founding Leadership</h4>
            <div className="flex flex-wrap gap-2">
              {startup.founders.map((founder, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gold-400" />
                  {founder}
                </span>
              ))}
            </div>
          </div>

          {/* Key Backers & Syndicate */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Institutional Syndicate & Backers</h4>
            <div className="flex flex-wrap gap-2">
              {startup.investors.map((inv, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
                  {inv}
                </span>
              ))}
            </div>
          </div>

          {/* Traction Highlights */}
          {startup.metrics && (
            <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-gold-400" />
              <span>Key Velocity Metric: <strong>{startup.metrics}</strong></span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenSubmit();
            }}
            className="text-xs font-mono text-gold-400 hover:underline flex items-center gap-1"
          >
            Claim or update this startup dossier →
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
