import React from 'react';
import { Calendar, MapPin, Users, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export default function EventsCalendar({ events = [] }) {
  return (
    <section id="events" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-3 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-gold-400 rounded-sm transform rotate-45"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-400">
                ECOSYSTEM GATHERINGS
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white dark:text-white light:text-slate-900 tracking-tight">
              Dubai Tech Summits & Demo Days
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            UAE INNOVATION CALENDAR 2026
          </span>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((ev) => (
            <div 
              key={ev.id}
              className="rounded-2xl p-5 border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-900 dark:bg-obsidian-900 light:bg-white shadow-card-dark flex flex-col justify-between hover:border-gold-500/40 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    {ev.badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {ev.daysLeft}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white dark:text-white light:text-slate-900 group-hover:text-gold-300 transition-colors">
                  {ev.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ev.attendees}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 line-clamp-3 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 dark:border-white/5 light:border-slate-100 flex items-center justify-between">
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-gold-400 hover:text-gold-300 transition-colors group/link"
                >
                  <span>Register & Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
