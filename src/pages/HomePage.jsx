import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, Calendar, Briefcase } from "lucide-react";
import { CATEGORIES, ARTICLES, featuredArticle, latestArticles, byCategory } from "@/data/articles";
import SEO from "@/components/SEO";
import { getOrganizationSchema, getWebSiteSchema, buildCanonical } from "@/lib/seo";
import { StoryOverlay, StoryCard, StoryRow, MoreLink } from "@/components/ArticleCard";
import MostRead from "@/components/MostRead";
import SectionHead from "@/components/SectionHead";
import Briefing from "@/components/Briefing";
import Reveal from "@/components/Reveal";
import LatestBar from "@/components/LatestBar";
import NumbersRail from "@/components/NumbersRail";

const today = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Dubai",
}).format(new Date());

/* ---------- Hero: one lead tile + two stacked ---------- */
const Hero = ({ lead, side }) => (
  <section className="wrap pt-5 sm:pt-6" aria-label="Top stories">
    <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10 rise">
      <div>
        <p className="eyebrow">{today} · {ARTICLES.length} stories</p>
        <h1 className="display mt-2 text-[2.4rem] sm:text-[3.4rem] lg:text-[4.2rem] leading-[0.92]">
          Today in Dubai<span className="text-acc">.</span>
        </h1>
      </div>
      <LatestBar className="md:max-w-[26rem] lg:max-w-[30rem]" />
    </div>
    <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:h-[min(44rem,80vh)]">
      <StoryOverlay article={lead} eager className="aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:col-span-8 lg:row-span-2 rise rise-1" />
      {side.map((a, i) => (
        <StoryOverlay
          key={a.slug}
          article={a}
          size="sm"
          eager
          className={`aspect-[16/10] lg:aspect-auto lg:col-span-4 rise rise-${i + 2}`}
        />
      ))}
    </div>
  </section>
);

/* ---------- Latest river + most read ---------- */
const Latest = ({ items }) => (
  <section className="wrap pt-16 sm:pt-24" data-testid="latest-strip" aria-labelledby="latest-heading">
    <SectionHead eyebrow="Just filed" title="Latest" id="latest-heading" to="/search" linkLabel="Search the archive" />
    <div className="mt-8 grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8 border-t hairline">
        {items.map((a, i) => (
          <Reveal key={a.slug} delay={i * 50}>
            <StoryRow article={a} index={i + 1} />
          </Reveal>
        ))}
      </div>
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <MostRead />
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Sections explorer (tabs) ---------- */
const Explorer = () => {
  const tabs = CATEGORIES.filter((c) => c.slug !== "founder-stories");
  const [active, setActive] = useState(tabs[0].slug);
  const cat = tabs.find((c) => c.slug === active);
  const arts = byCategory(active).slice(0, 3);
  const [first, ...rest] = arts;

  return (
    <section className="wrap pt-16 sm:pt-24" aria-labelledby="explore-heading" data-testid={`category-section-${active}`}>
      <SectionHead eyebrow="Explore" title="By section" id="explore-heading" to={`/category/${active}`} linkLabel={`All ${cat.short.toLowerCase()}`} testid={`category-all-${active}`} />
      <div role="tablist" aria-label="Sections" className="mt-7 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((c) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={c.slug === active}
            onClick={() => setActive(c.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-[0.88rem] font-semibold transition-colors duration-200 ${
              c.slug === active ? "bg-ink text-bg" : "bg-surface text-body ring-1 ring-line/10 hover:text-ink hover:ring-line/30"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[0.92rem] text-muted">{cat.description}</p>

      <div key={active} role="tabpanel" className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {first && (
          <StoryCard article={first} size="lg" showDek aspect="aspect-[16/10]" className="sm:col-span-2 rise" />
        )}
        {rest.map((a, i) => (
          <StoryCard key={a.slug} article={a} aspect="aspect-[4/3]" className={`rise rise-${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

/* ---------- Founders rail ---------- */
const Founders = () => {
  const arts = byCategory("founder-stories");
  if (!arts.length) return null;
  return (
    <section className="pt-16 sm:pt-24" aria-labelledby="founders-heading" data-testid="category-section-founder-stories">
      <div className="wrap">
        <SectionHead
          eyebrow="Profiles & interviews"
          title="The founders"
          id="founders-heading"
          to="/category/founder-stories"
          linkLabel="All founder stories"
          testid="category-all-founder-stories"
        />
      </div>
      <div className="mt-8 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 lg:scroll-px-10">
        <ul className="flex w-max gap-4 px-4 sm:px-6 lg:px-10 pb-2">
          {arts.map((a) => (
            <li key={a.slug} className="snap-start">
              <StoryOverlay article={a} size="sm" className="aspect-[3/4] w-[17rem] sm:w-[21rem]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ---------- Ecosystem Pillars: Setup, Events, Jobs ---------- */
const EcosystemHub = () => (
  <section className="wrap pt-16 sm:pt-24" aria-labelledby="ecosystem-heading">
    <SectionHead
      eyebrow="Practical utility"
      title="The Dubai Ecosystem"
      id="ecosystem-heading"
      to="/setup"
      linkLabel="Explore playbooks"
    />
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <Reveal delay={0} className="rounded-tile bg-surface p-6 sm:p-8 ring-1 ring-line/10 flex flex-col justify-between group hover:ring-line/25 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-raised text-acc">
              <Building2 size={20} />
            </span>
            <span className="font-mono text-[0.75rem] text-muted">01 / Setup</span>
          </div>
          <h3 className="mt-5 font-display text-[1.45rem] font-bold text-ink group-hover:text-acc transition-colors">
            Business Setup & Playbooks
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
            Compare DIFC, DMCC, DWTC and mainland licenses, banking with Wio, and 10-year Golden Visa requirements.
          </p>
        </div>
        <Link to="/setup" className="mt-6 pt-4 border-t hairline inline-flex items-center gap-1.5 font-semibold text-[0.88rem] text-ink group-hover:text-acc">
          View Formation Guides <ArrowUpRight size={15} />
        </Link>
      </Reveal>

      <Reveal delay={60} className="rounded-tile bg-surface p-6 sm:p-8 ring-1 ring-line/10 flex flex-col justify-between group hover:ring-line/25 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-raised text-acc">
              <Calendar size={20} />
            </span>
            <span className="font-mono text-[0.75rem] text-muted">02 / Events</span>
          </div>
          <h3 className="mt-5 font-display text-[1.45rem] font-bold text-ink group-hover:text-acc transition-colors">
            Upcoming Startup Events
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
            Curated calendar of venture pitch nights, angel circles, demo days, and tech summits across Dubai.
          </p>
        </div>
        <Link to="/events" className="mt-6 pt-4 border-t hairline inline-flex items-center gap-1.5 font-semibold text-[0.88rem] text-ink group-hover:text-acc">
          Explore Calendar <ArrowUpRight size={15} />
        </Link>
      </Reveal>

      <Reveal delay={120} className="rounded-tile bg-surface p-6 sm:p-8 ring-1 ring-line/10 flex flex-col justify-between group hover:ring-line/25 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-raised text-acc">
              <Briefcase size={20} />
            </span>
            <span className="font-mono text-[0.75rem] text-muted">03 / Careers</span>
          </div>
          <h3 className="mt-5 font-display text-[1.45rem] font-bold text-ink group-hover:text-acc transition-colors">
            Dubai Startup Jobs Board
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
            Engineering, product, marketing, and operations roles at seed to Series B companies with transparent AED salaries.
          </p>
        </div>
        <Link to="/jobs" className="mt-6 pt-4 border-t hairline inline-flex items-center gap-1.5 font-semibold text-[0.88rem] text-ink group-hover:text-acc">
          Browse Verified Jobs <ArrowUpRight size={15} />
        </Link>
      </Reveal>
    </div>
  </section>
);

const HomePage = () => {
  const lead = featuredArticle();
  const pool = lead ? latestArticles(30).filter((a) => a.slug !== lead.slug) : [];
  const side = pool.slice(0, 2);
  const latest = pool.slice(2, 8);

  return (
    <div data-testid="home-page" className="pb-20">
      <SEO
        title="Dubai Startups Daily · The Daily Pulse of Dubai’s Startup Ecosystem"
        description="The Daily Pulse of Dubai’s Startup Ecosystem. Breaking news on seed-to-growth funding rounds, AI, venture capital, business setup, tech events, and startup jobs in Dubai."
        canonical={buildCanonical("/")}
        keywords={[
          "Dubai startups",
          "Dubai startup ecosystem",
          "Dubai startup news",
          "Dubai technology news",
          "UAE venture capital",
          "DIFC fintech",
        ]}
        schema={[getOrganizationSchema(), getWebSiteSchema()]}
      />
      {lead ? (
        <>
          <Hero lead={lead} side={side} />
          <NumbersRail />
          <Latest items={latest} />
          <Explorer />
        </>
      ) : (
        <section className="wrap pt-12 sm:pt-16">
          <div className="rounded-tile bg-surface p-10 sm:p-16 text-center ring-1 ring-line/10" data-testid="home-empty">
            <h1 className="display text-[2.2rem] sm:text-[3rem]">No stories published yet.</h1>
            <p className="mt-3 text-muted">Check back soon for the latest news from Dubai’s startup ecosystem.</p>
          </div>
        </section>
      )}
      <EcosystemHub />
      <div className="pt-16 sm:pt-24">
        <Briefing />
      </div>
      <Founders />
      <div className="wrap pt-16 flex justify-center">
        <MoreLink to="/about">About the newsroom</MoreLink>
      </div>
    </div>
  );
};

export default HomePage;
