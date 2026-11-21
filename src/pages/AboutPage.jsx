import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Newspaper, TrendingUp, Cpu, Users, LineChart } from "lucide-react";
import { CATEGORIES } from "@/data/articles";

const icons = {
  "startup-news": Newspaper,
  "funding-investment": Landmark,
  "business-news": TrendingUp,
  "technology-ai": Cpu,
  "founder-stories": Users,
  "insights-analysis": LineChart,
};

const AboutPage = () => (
  <div data-testid="about-page" className="bg-ivory dark:bg-navy-950 transition-colors duration-200">
    <section className="bg-ink dark:bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Our mission</span>
        <h1 className="font-headline font-black text-4xl sm:text-6xl leading-[1.05] mt-4 max-w-3xl text-white" data-testid="about-headline">
          A trusted digital destination for Dubai’s startup, business and technology news.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70">
          Dubai Startups Daily exists to document the companies, capital and ideas building this city — with the
          rigour of a business daily and the pacing of the ecosystem we cover.
        </p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="border-t-[3px] border-ink dark:border-white/20 pt-5">
        <h2 className="font-headline font-black text-3xl text-ink dark:text-white">What we cover</h2>
      </div>
      <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((c) => {
          const Icon = icons[c.slug] || Newspaper;
          return (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              data-testid={`about-section-${c.slug}`}
              className="group border border-neutral-200 dark:border-white/10 hover:border-gold dark:hover:border-gold bg-white dark:bg-navy-900 p-7 transition-colors duration-300"
            >
              <span className="w-10 h-10 flex items-center justify-center bg-ink dark:bg-navy-800 text-gold group-hover:bg-gold group-hover:text-ink transition-colors duration-300">
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <h3 className="font-headline font-bold text-xl mt-5 text-ink dark:text-white group-hover:text-gold transition-colors duration-300">
                {c.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-slate-300">{c.description}</p>
            </Link>
          );
        })}
      </div>
    </section>

    <section className="bg-mist dark:bg-navy-900/40 border-t border-neutral-200 dark:border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">Independence</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-slate-300">
            Our newsroom operates with strict editorial independence. Sponsored content and partners are always
            clearly labelled.
          </p>
        </div>
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">Local focus</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-slate-300">
            Based in Dubai, reporting from the ground across DIFC, DWTC, Area 2071, Hub71 and the broader UAE
            innovation theatre.
          </p>
        </div>
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">The desk</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-slate-300">
            Pitch stories, share embargoed funding rounds or correct reporting directly at{" "}
            <a href="mailto:desk@dubaistartupsdaily.ae" className="text-tech dark:text-sky-400 underline">
              desk@dubaistartupsdaily.ae
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
