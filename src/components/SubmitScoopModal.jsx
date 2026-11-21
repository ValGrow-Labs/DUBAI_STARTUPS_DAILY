import React, { useState } from 'react';
import { X, Send, Upload, Sparkles, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubmitScoopModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    submitterName: '',
    email: '',
    category: 'Fintech',
    scoopType: 'Funding Round',
    amount: '',
    synopsis: '',
    deckUrl: '',
    confidential: true
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#10B981', '#3B82F6']
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-obsidian-900 dark:bg-obsidian-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-obsidian-850 to-obsidian-900 dark:from-obsidian-850 dark:to-obsidian-900 light:from-slate-100 light:to-white border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white dark:text-white light:text-slate-900">
                Submit Deal Scoop or Founder Pitch
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Direct wire to Dubai Startups Daily editorial board
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

        {/* Content */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
            
            <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>We honor embargoes and confidentiality. Your scoop is protected under UAE journalistic ethics.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Startup / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex AI Labs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Submitter Name & Role
                </label>
                <input
                  type="text"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="e.g. Sarah Miller (Founder / PR Partner)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Official / Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@apex.ai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Announcement Type
                </label>
                <select
                  value={formData.scoopType}
                  onChange={(e) => setFormData({ ...formData, scoopType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
                >
                  <option value="Funding Round">Funding Round (Seed, Series A+)</option>
                  <option value="Product Launch">Product Launch & AI Breakthrough</option>
                  <option value="Acquisition / M&A">Acquisition / M&A Deal</option>
                  <option value="Licensing / Regulatory">UAE Regulatory License Approval</option>
                  <option value="Executive Hire">Tier-1 Executive Hire</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Funding Amount (if applicable)
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. $12.5M Series A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Pitch Deck / Release Link
                </label>
                <input
                  type="url"
                  value={formData.deckUrl}
                  onChange={(e) => setFormData({ ...formData, deckUrl: e.target.value })}
                  placeholder="https://docsend.com/view/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Scoop Synopsis / Key News Details
              </label>
              <textarea
                rows={3}
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                placeholder="Include lead investor names, expansion plans, and planned embargo release date..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-gold-500/50"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 hover:from-gold-400 hover:to-amber-500 transition-all shadow-gold-glow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Transmit Scoop to Editorial Wire
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display font-bold text-xl text-white dark:text-white light:text-slate-900">
              Scoop Transmitted Successfully
            </h3>

            <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-md mx-auto">
              Our lead editors at the DIFC bureau have received your briefing for <strong>{formData.companyName}</strong>. If selected for feature coverage, a reporter will reach out to {formData.email}.
            </p>

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
