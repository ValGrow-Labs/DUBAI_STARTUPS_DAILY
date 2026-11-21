import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState(['Fintech Deals', 'Sovereign AI']);

  const interestOptions = ['Fintech Deals', 'Sovereign AI', 'PropTech', 'VC Term Sheets', 'Regulatory Sandboxes'];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#10B981', '#FFFFFF']
    });

    setSubscribed(true);
  };

  return (
    <section id="newsletter" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden border border-gold-500/30 bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-950 dark:from-obsidian-900 dark:to-obsidian-950 light:from-slate-900 light:to-slate-950 text-white p-8 sm:p-12 shadow-2xl">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-mono font-bold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              THE 7:00 AM GULF WIRE
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-tight">
              Start Your Morning Ahead of the <span className="gold-gradient-text">GCC Venture Cycle</span>
            </h2>

            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Every weekday morning at 7:00 AM GST, over 42,000 managing partners, sovereign fund analysts, and founders read our confidential memo on unannounced term sheets, regulatory approvals, and cap table shifts.
            </p>

            {/* Interest Tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-1">CALIBRATE YOUR BRIEF:</span>
              {interestOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                    selectedInterests.includes(item)
                      ? 'bg-gold-500 text-obsidian-950 font-bold border-gold-400'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-gold-500/30'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Subscription Form */}
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your institutional or work email..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950/80 border border-white/20 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 hover:from-gold-400 hover:to-amber-500 transition-all shadow-gold-glow flex items-center justify-center gap-2 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Join The Wire
                </button>
              </form>
            ) : (
              <div className="mt-8 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Welcome to <strong>The 7:00 AM Gulf Wire</strong>. Check your inbox to confirm your transmission frequency.
                </span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Spam • 1-Click Unsubscribe
              </span>
              <span>•</span>
              <span>Audited by Dubai Media City Compliance</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
