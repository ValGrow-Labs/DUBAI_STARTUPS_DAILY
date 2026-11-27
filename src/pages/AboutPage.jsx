import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, ARTICLES, byCategory, initials } from "@/data/articles";
import Reveal from "@/components/Reveal";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { getOrganizationSchema, getBreadcrumbSchema, buildCanonical } from "@/lib/seo";

const PRINCIPLES = [
  {
    title: "Sources, named or explained",
    body: "Funding figures are confirmed with the company or two people familiar with the deal. When we can’t name a source, we say how they know.",
  },
  {
    title: "Sponsored work is labelled",
    body: "Partners never see a story before it runs. Commercial content carries a clear label at the top of the page.",
  },
  {
    title: "Corrections in public",
    body: "Mistakes are fixed in the story with a dated note explaining what changed. Spot one? Write to the desk.",
  },
];

const AboutPage = () => {
  const authors = [...new Map(ARTICLES.map((a) => [a.author, a.authorRole])).entries()];
  const pageUrl = buildCanonical("/about");
  const breadcrumbItems = [{ name: "About the Newsroom", path: "/about" }];

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Dubai Startups Daily",
    description:
      "Dubai Startups Daily reports on founders, venture capital, the economy and technology across Dubai with business desk standards.",
    url: pageUrl,
    mainEntity: getOrganizationSchema(),
  };

  const schemas = [aboutSchema, getBreadcrumbSchema(breadcrumbItems)];

  return (
    <div data-testid="about-page" className="pb-24">
      <SEO
        title="About the Newsroom & Editorial Standards"
        description="We cover the people and money building Dubai's next companies. Read our sourcing principles, corrections policy, and editorial ethics."
        canonical={pageUrl}
        keywords={[
          "Dubai Startups Daily",
          "Dubai tech journalism",
          "Dubai startup newsroom",
          "UAE business media ethics",
          "Pitch Dubai desk",
        ]}
        schema={schemas}
      />
      <section className="wrap pt-10 sm:pt-16">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <p className="eyebrow rise">About the newsroom</p>
        <h1
          className="display mt-4 max-w-[17ch] text-[2.8rem] sm:text-[4.6rem] lg:text-[6rem] leading-[0.92] tracking-[-0.04em] rise rise-1"
          data-testid="about-headline"
        >
          We cover the people and money building Dubai’s next companies<span className="text-acc">.</span>
        </h1>
        <div className="mt-10 grid lg:grid-cols-12 rise rise-2">
          <p className="lg:col-span-6 lg:col-start-7 text-[1.15rem] leading-[1.65] text-body">
            Dubai Startups Daily reports exclusively on founders, venture capital, the economy and technology across Dubai, with
            the standards of a business desk and the pace of the ecosystem we cover.
          </p>
        </div>
      </section>

      <section className="wrap mt-20 grid gap-4 md:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 90} className={`rounded-tile p-7 sm:p-8 ${i === 0 ? "bg-lime text-onlime" : "bg-surface ring-1 ring-line/10"}`}>
            <span className={`font-mono text-[0.75rem] ${i === 0 ? "text-onlime/70" : "text-muted"}`}>0{i + 1}</span>
            <h2 className={`mt-10 font-display text-[1.6rem] font-bold leading-[1.02] tracking-[-0.03em] ${i === 0 ? "text-onlime" : "text-ink"}`}>
              {p.title}
            </h2>
            <p className={`mt-3 text-[0.95rem] leading-relaxed ${i === 0 ? "text-onlime/80" : "text-muted"}`}>{p.body}</p>
          </Reveal>
        ))}
      </section>

      <section className="wrap mt-24 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="display text-[2.2rem] sm:text-[2.8rem]">What we cover</h2>
          <ul className="mt-6 border-t hairline">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/category/${c.slug}`}
                  data-testid={`about-section-${c.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b hairline py-5"
                >
                  <span>
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-[1.45rem] font-bold tracking-[-0.03em] text-ink">{c.name}</span>
                      <span className="meta">{byCategory(c.slug).length}</span>
                    </span>
                    <span className="mt-1 block text-[0.92rem] text-muted">{c.description}</span>
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-line/15 text-ink transition-colors duration-200 group-hover:bg-lime group-hover:text-onlime group-hover:ring-transparent">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="display text-[2.2rem] sm:text-[2.8rem]">The desk</h2>
          <ul className="mt-6 space-y-2">
            {authors.map(([name, role]) => (
              <li key={name} className="flex items-center gap-3 rounded-card bg-surface p-3 ring-1 ring-line/10">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-raised font-display text-[0.85rem] font-bold text-ink">
                  {initials(name)}
                </span>
                <span>
                  <span className="block text-[0.93rem] font-semibold text-ink">{name}</span>
                  <span className="block text-[0.82rem] text-muted">{role}</span>
                </span>
              </li>
            ))}
          </ul>
          <a href="mailto:desk@dubaistartupsdaily.ae" className="btn-lime mt-6 w-full">
            Pitch the desk
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
