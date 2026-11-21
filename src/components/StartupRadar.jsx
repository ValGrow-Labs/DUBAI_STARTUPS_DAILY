import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ExternalLink, ShieldCheck, 
  MapPin, DollarSign, Users, Sparkles, Building2, 
  Check, ArrowRight, Grid, List 
} from 'lucide-react';

export default function StartupRadar({ 
  startups = [], 
  categories = [], 
  onSelectStartup 
}) {
  const [selectedCategory, setSelectedCategory] = useState("All Sectors");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  const stagesList = ["All Stages", "Seed", "Series A", "Series B", "Pre-IPO", "Unicorn"];

  // Filter logic
  const filteredStartups = useMemo(() => {
    return startups.filter(st => {
      const matchesCat = selectedCategory === "All Sectors" || st.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesStage = selectedStage === "All Stages" || 
        (selectedStage === "Unicorn" ? (st.highlight === "Unicorn" || st.valuation.includes("B")) : st.stage.toLowerCase().includes(selectedStage.toLowerCase()));
      const matchesQuery = searchQuery === "" || 
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.founders.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        st.investors.some(inv => inv.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCat && matchesStage && matchesQuery;
    });
  }, [startups, selectedCategory, selectedStage, searchQuery]);

  return (
    <section id="radar" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm transform rotate-45"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                LIVE DEALFLOW DIRECTORY
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white dark:text-white light:text-slate-900 tracking-tight">
              The UAE Startup Radar
            </h2>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl">
              Track the high-momentum ventures, sovereign-backed champions, and seed breakout teams shaping the Dubai innovation axis.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-xs font-mono">
              <span className="text-slate-400">SHOWING:</span>{" "}
              <strong className="text-gold-400">{filteredStartups.length}</strong> OF {startups.length} VENTURES
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-obsidian-900/90 dark:bg-obsidian-900/90 light:bg-white rounded-2xl p-4 sm:p-5 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-card-dark mb-8 space-y-4">
          
          {/* Search + Stage Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by startup name, founder, investor (e.g. Hosam, Sequoia, G42)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Stage Selector */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {stagesList.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all border ${
                    selectedStage === stage
                      ? 'bg-gold-500 text-obsidian-950 font-bold border-gold-400 shadow-gold-glow'
                      : 'bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border-white/5 hover:border-gold-500/30'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Sectors Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono text-slate-400 shrink-0 mr-1">SECTOR:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-obsidian-950 font-bold shadow'
                    : 'bg-obsidian-800/80 dark:bg-obsidian-800/80 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Startups Display: Grid Mode */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredStartups.map((st) => (
              <div 
                key={st.id}
                onClick={() => onSelectStartup(st)}
                className="rounded-2xl p-5 border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-900 dark:bg-obsidian-900 light:bg-white hover:border-gold-500/40 shadow-card-dark transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
              >
                {/* Top Row: Logo + Stage */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-800 dark:bg-obsidian-800 light:bg-slate-100 shrink-0">
                      <img src={st.logo} alt={st.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
                        {st.stage}
                      </span>
                      {st.highlight && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400">
                          ✦ {st.highlight}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Tagline */}
                  <h3 className="font-display font-bold text-lg text-white dark:text-white light:text-slate-900 group-hover:text-gold-300 transition-colors">
                    {st.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 block mb-2">{st.category}</span>
                  <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 line-clamp-2 leading-relaxed">
                    {st.tagline}
                  </p>
                </div>

                {/* Financials & Metrics */}
                <div className="mt-4 pt-4 border-t border-white/5 dark:border-white/5 light:border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">TOTAL RAISED</span>
                      <strong className="text-emerald-400 text-sm">{st.raised}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">VALUATION</span>
                      <strong className="text-white dark:text-white light:text-slate-800 text-sm">{st.valuation}</strong>
                    </div>
                  </div>

                  {/* Location & Details button */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-100">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-gold-400" />
                      {st.location}
                    </span>
                    <span className="text-gold-400 group-hover:translate-x-1 transition-transform font-bold text-xs flex items-center gap-1">
                      Deep Dive <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Startups Display: Table Mode */}
        {viewMode === 'table' && (
          <div className="rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-obsidian-900 dark:bg-obsidian-900 light:bg-white overflow-hidden shadow-card-dark">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-obsidian-850 dark:bg-obsidian-850 light:bg-slate-100 text-slate-400 text-xs font-mono uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Raised</th>
                    <th className="py-3 px-4">Valuation</th>
                    <th className="py-3 px-4">Hub / Location</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 dark:divide-white/5 light:divide-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700">
                  {filteredStartups.map((st) => (
                    <tr 
                      key={st.id} 
                      onClick={() => onSelectStartup(st)}
                      className="hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white dark:text-white light:text-slate-900 flex items-center gap-3">
                        <img src={st.logo} alt={st.name} className="w-7 h-7 rounded-lg object-cover" />
                        <span>{st.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{st.category}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
                          {st.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{st.raised}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white dark:text-white light:text-slate-900">{st.valuation}</td>
                      <td className="py-3.5 px-4 text-xs">{st.location}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-gold-500 hover:text-obsidian-950 transition-colors"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredStartups.length === 0 && (
          <div className="text-center py-12 bg-obsidian-900 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-sm">No startups matched your search and filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory("All Sectors"); setSelectedStage("All Stages"); setSearchQuery(""); }}
              className="mt-3 text-xs font-bold uppercase text-gold-400 underline"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
