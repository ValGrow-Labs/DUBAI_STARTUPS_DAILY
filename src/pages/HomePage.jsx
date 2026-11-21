import { useState } from "react";
import { CATEGORIES, ARTICLES, featuredArticle, latestArticles, byCategory } from "@/data/articles";
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

const HomePage = () => {
  const lead = featuredArticle();
  const pool = latestArticles(30).filter((a) => a.slug !== lead.slug);
  const side = pool.slice(0, 2);
  const latest = pool.slice(2, 8);

  return (
    <div data-testid="home-page" className="pb-20">
      <Hero lead={lead} side={side} />
      <NumbersRail />
      <Latest items={latest} />
      <Explorer />
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
