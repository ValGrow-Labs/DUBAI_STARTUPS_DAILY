import { useState } from "react";
import { ArrowUpRight, Building2, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { FREEZONES_DIRECTORY, SETUP_GUIDES, SETUP_STEPS } from "@/data/setup-guides";
import { getBreadcrumbSchema, buildCanonical, SITE_NAME, SITE_URL } from "@/lib/seo";

const SetupPage = () => {
  const [activeGuide, setActiveGuide] = useState(SETUP_GUIDES[0].slug);

  const currentGuide = SETUP_GUIDES.find((g) => g.slug === activeGuide) || SETUP_GUIDES[0];
  const breadcrumbItems = [{ name: "Business Setup & Guides", path: "/setup" }];

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Launch, License and Scale a Startup in Dubai",
    description:
      "Comprehensive playbooks for tech founders: comparing DIFC vs. DMCC vs. Mainland, securing corporate bank accounts with Wio, and qualifying for the 10-year UAE Golden Visa.",
    url: buildCanonical("/setup"),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: [
      { "@type": "Thing", name: "Dubai Business Setup" },
      { "@type": "Thing", name: "DIFC Company Formation" },
      { "@type": "Thing", name: "DMCC Free Zone" },
    ],
  };

  const schemas = [guideSchema, getBreadcrumbSchema(breadcrumbItems)];

  return (
    <div data-testid="setup-page" className="pb-24">
      <SEO
        title="Dubai Business Setup & Startup Playbooks"
        description="Comprehensive guides for launching a startup in Dubai: DIFC vs. DMCC vs. Mainland, corporate banking with Wio, and the 10-Year UAE Golden Visa."
        canonical={buildCanonical("/setup")}
        keywords={[
          "How to start a business in Dubai",
          "Dubai free zone company setup",
          "DIFC company setup",
          "DMCC company setup",
          "Dubai mainland company formation",
          "UAE Golden Visa tech founders",
        ]}
        schema={schemas}
      />
      {/* Hero section */}
      <section className="wrap pt-10 sm:pt-16">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <p className="eyebrow rise">Business Setup & Practical Guides</p>
        <h1
          className="display mt-3 max-w-[18ch] text-[2.6rem] sm:text-[4.2rem] lg:text-[5.4rem] leading-[0.93] tracking-[-0.04em] rise rise-1"
          data-testid="setup-headline"
        >
          How to launch, license and scale a startup in Dubai<span className="text-acc">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[1.12rem] leading-relaxed text-body rise rise-2">
          Clear, vetted playbooks for tech founders: comparing DIFC vs. DMCC vs. Mainland, securing corporate bank accounts without waiting months, and qualifying for the 10-year UAE Golden Visa.
        </p>

        {/* Quick summary metric cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3 rise rise-3">
          <div className="rounded-card bg-surface p-6 ring-1 ring-line/10">
            <span className="font-mono text-[0.8rem] text-muted">01 / Ownership</span>
            <p className="display mt-3 text-[1.8rem] font-bold text-ink">100% Foreign</p>
            <p className="mt-1 text-[0.88rem] text-muted">Available across both Dubai free zones and most mainland commercial categories.</p>
          </div>
          <div className="rounded-card bg-surface p-6 ring-1 ring-line/10">
            <span className="font-mono text-[0.8rem] text-muted">02 / Startup Licensing</span>
            <p className="display mt-3 text-[1.8rem] font-bold text-ink">From AED 5,500</p>
            <p className="mt-1 text-[0.88rem] text-muted">Subsidized innovation licenses at hubs like DIFC Innovation Hub and Dtec.</p>
          </div>
          <div className="rounded-card bg-surface p-6 ring-1 ring-line/10">
            <span className="font-mono text-[0.8rem] text-muted">03 / Golden Visa</span>
            <p className="display mt-3 text-[1.8rem] font-bold text-lime">10-Year Self-Sponsored</p>
            <p className="mt-1 text-[0.88rem] text-muted">For founders of endorsed startups or accredited incubator graduates.</p>
          </div>
        </div>
      </section>

      {/* Formation Roadmap */}
      <section className="wrap mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b hairline pb-6">
          <div>
            <p className="eyebrow">The Step-by-Step Path</p>
            <h2 className="display mt-2 text-[2.2rem] sm:text-[3rem]">The 6-Step Formation Roadmap</h2>
          </div>
          <p className="text-[0.92rem] text-muted max-w-sm">From initial trade name to your first corporate wire transfer.</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SETUP_STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 60} className="rounded-tile bg-surface p-6 sm:p-7 ring-1 ring-line/10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[0.85rem] font-bold text-acc">{s.step}</span>
                <h3 className="mt-4 font-display text-[1.35rem] font-bold leading-tight text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{s.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t hairline flex items-center gap-1.5 text-[0.8rem] text-muted">
                <CheckCircle2 size={14} className="text-acc" />
                <span>Verified against official DET/Free Zone policy</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Free Zone Directory */}
      <section className="wrap mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b hairline pb-6">
          <div>
            <p className="eyebrow">Directory</p>
            <h2 className="display mt-2 text-[2.2rem] sm:text-[3rem]">Top Dubai Startup Free Zones</h2>
          </div>
          <p className="text-[0.92rem] text-muted">Compare hubs by licensing, sector specialty and jurisdiction.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FREEZONES_DIRECTORY.map((fz, idx) => (
            <Reveal key={fz.name} delay={idx * 60} className="rounded-card bg-surface p-6 ring-1 ring-line/10 hover:ring-line/25 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-raised px-3 py-1 font-mono text-[0.75rem] font-semibold text-ink">
                  <Building2 size={13} className="text-acc" />
                  {fz.short}
                </span>
                <span className="font-mono text-[0.75rem] text-muted">{fz.location}</span>
              </div>
              <h3 className="mt-4 font-display text-[1.4rem] font-bold text-ink">{fz.name}</h3>
              <p className="mt-1 text-[0.86rem] text-acc">{fz.focus}</p>

              <div className="mt-6 space-y-2.5 border-t hairline pt-4 text-[0.86rem]">
                <div className="flex justify-between">
                  <span className="text-muted">License Cost:</span>
                  <span className="font-semibold text-ink">{fz.licenseFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Visa Quota:</span>
                  <span className="text-ink">{fz.visas}</span>
                </div>
              </div>

              <div className="mt-5 rounded-[10px] bg-raised/70 p-3 text-[0.82rem] leading-snug text-muted">
                <span className="font-semibold text-ink">Edge: </span>
                {fz.highlight}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deep-Dive Playbooks */}
      <section className="wrap mt-24">
        <div className="border-b hairline pb-6">
          <p className="eyebrow">Playbooks</p>
          <h2 className="display mt-2 text-[2.2rem] sm:text-[3rem]">In-Depth Founder Setup Guides</h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Guide Selector Tabs */}
          <div className="lg:col-span-4 space-y-2">
            {SETUP_GUIDES.map((g) => {
              const isSelected = g.slug === activeGuide;
              return (
                <button
                  key={g.slug}
                  onClick={() => setActiveGuide(g.slug)}
                  className={`w-full text-left rounded-card p-4 transition-all duration-200 border ${
                    isSelected
                      ? "bg-raised border-acc/40 shadow-sm"
                      : "bg-surface border-transparent hover:bg-raised/50"
                  }`}
                >
                  <span className="font-mono text-[0.72rem] uppercase tracking-wider text-acc">{g.category}</span>
                  <h4 className="mt-1 font-display text-[1.1rem] font-bold leading-snug text-ink">{g.title}</h4>
                  <div className="mt-3 flex items-center justify-between text-[0.78rem] text-muted">
                    <span>{g.readTime}</span>
                    <span className="flex items-center gap-1">Read guide <ChevronRight size={13} /></span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Guide Viewer */}
          <div className="lg:col-span-8 rounded-tile bg-surface p-7 sm:p-10 ring-1 ring-line/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-lime px-3 py-1 font-mono text-[0.75rem] font-bold text-onlime">
                {currentGuide.category}
              </span>
              <span className="text-[0.82rem] text-muted">Updated {currentGuide.updated}</span>
            </div>
            <h3 className="display mt-4 text-[2rem] sm:text-[2.5rem] leading-tight text-ink">{currentGuide.title}</h3>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-body border-b hairline pb-6">{currentGuide.summary}</p>

            <div className="mt-8 space-y-7">
              {currentGuide.sections.map((sec, i) => (
                <div key={i}>
                  <h4 className="font-display text-[1.25rem] font-bold text-ink">{sec.heading}</h4>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{sec.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t hairline flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[0.85rem] text-muted">
                <ShieldCheck size={16} className="text-acc" />
                <span>Need tailored setup advice for your business activity?</span>
              </div>
              <a
                href="mailto:desk@dubaistartupsdaily.ae?subject=Business%20Setup%20Inquiry"
                className="btn-lime text-[0.85rem] py-2 px-4 whitespace-nowrap"
              >
                Consult Setup Desk
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SetupPage;
