import { useState, useMemo } from "react";
import { MapPin, ArrowUpRight, Search, Sparkles, Filter } from "lucide-react";
import Reveal from "@/components/Reveal";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { STARTUP_JOBS, JOB_CATEGORIES, WORKPLACE_TYPES } from "@/data/jobs";
import { getJobPostingSchema, getBreadcrumbSchema, buildCanonical } from "@/lib/seo";

const JobsPage = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedWorkplace, setSelectedWorkplace] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const pageUrl = buildCanonical("/jobs");
  const breadcrumbItems = [{ name: "Startup Jobs", path: "/jobs" }];

  const schemas = [
    getBreadcrumbSchema(breadcrumbItems),
    ...STARTUP_JOBS.slice(0, 5).map((j) => getJobPostingSchema(j, pageUrl)),
  ].filter(Boolean);

  const filteredJobs = useMemo(() => {
    return STARTUP_JOBS.filter((j) => {
      const matchesCat = selectedCat === "All" || j.category === selectedCat;
      const matchesWorkplace = selectedWorkplace === "All" || j.workplace.includes(selectedWorkplace);
      const matchesSearch =
        !searchQuery.trim() ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesWorkplace && matchesSearch;
    });
  }, [selectedCat, selectedWorkplace, searchQuery]);

  return (
    <div data-testid="jobs-page" className="pb-24">
      <SEO
        title="Dubai Startup Jobs Board"
        description="Verified engineering, product, marketing, and operations roles at seed-to-Series B Dubai startups with transparent monthly salaries in AED."
        canonical={pageUrl}
        keywords={[
          "Dubai startup jobs",
          "UAE startup jobs",
          "Dubai technology jobs",
          "software engineer jobs Dubai",
          "fintech jobs Dubai",
        ]}
        schema={schemas}
      />
      {/* Hero */}
      <section className="wrap pt-10 sm:pt-16">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <p className="eyebrow rise">Startup Talent & Careers</p>
        <h1
          className="display mt-3 max-w-[17ch] text-[2.6rem] sm:text-[4.2rem] lg:text-[5.4rem] leading-[0.93] tracking-[-0.04em] rise rise-1"
          data-testid="jobs-headline"
        >
          Build the next breakout tech company in Dubai<span className="text-acc">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[1.12rem] leading-relaxed text-body rise rise-2">
          Curated opportunities at seed-to-Series B startups across DIFC, Internet City, and Silicon Oasis with transparent compensation in AED and founder equity.
        </p>

        {/* Quick ecosystem talent stat counters */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3 rise rise-3">
          <div className="rounded-card bg-surface p-5 ring-1 ring-line/10">
            <span className="font-mono text-[0.75rem] text-muted">01 / Curated Listings</span>
            <p className="display mt-2 text-[1.6rem] font-bold text-ink">{STARTUP_JOBS.length} Verified Roles</p>
            <p className="mt-1 text-[0.82rem] text-muted">Direct from Dubai-based tech founders and hiring teams.</p>
          </div>
          <div className="rounded-card bg-surface p-5 ring-1 ring-line/10">
            <span className="font-mono text-[0.75rem] text-muted">02 / Transparent Salaries</span>
            <p className="display mt-2 text-[1.6rem] font-bold text-lime">100% Disclosed</p>
            <p className="mt-1 text-[0.82rem] text-muted">Every role features transparent monthly compensation in AED.</p>
          </div>
          <div className="rounded-card bg-surface p-5 ring-1 ring-line/10">
            <span className="font-mono text-[0.75rem] text-muted">03 / Visa Sponsorship</span>
            <p className="display mt-2 text-[1.6rem] font-bold text-ink">UAE Work Visas</p>
            <p className="mt-1 text-[0.82rem] text-muted">Companies provide full residency & health insurance packages.</p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="wrap mt-16">
        <div className="flex flex-col gap-4 border-b hairline pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {JOB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-all whitespace-nowrap ${
                    selectedCat === cat
                      ? "bg-ink text-bg font-semibold"
                      : "bg-surface text-body hover:text-ink hover:bg-raised"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search role or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-surface pl-9 pr-4 py-1.5 text-[0.88rem] text-ink placeholder:text-muted outline-none ring-1 ring-line/10 focus:ring-acc"
              />
            </div>
          </div>

          {/* Workplace type secondary filters */}
          <div className="flex items-center gap-2 pt-2 text-[0.82rem]">
            <span className="text-muted flex items-center gap-1"><Filter size={13} /> Workplace:</span>
            {WORKPLACE_TYPES.map((wp) => (
              <button
                key={wp}
                onClick={() => setSelectedWorkplace(wp)}
                className={`rounded-[8px] px-2.5 py-1 transition-colors ${
                  selectedWorkplace === wp ? "bg-raised font-semibold text-ink ring-1 ring-line/20" : "text-muted hover:text-ink"
                }`}
              >
                {wp}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="mt-8 space-y-4">
          {filteredJobs.map((job, idx) => (
            <Reveal
              key={job.id}
              delay={idx * 40}
              className={`rounded-card bg-surface p-6 ring-1 transition-all ${
                job.featured ? "ring-acc/40 border-l-4 border-l-acc" : "ring-line/10 hover:ring-line/25"
              }`}
            >
              <div className="grid gap-6 md:grid-cols-12 md:items-center">
                {/* Job metadata & company */}
                <div className="md:col-span-8 flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-raised font-display text-[1rem] font-bold text-ink">
                    {job.companyInitials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink text-[1.05rem]">{job.company}</span>
                      {job.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 text-acc px-2 py-0.5 font-mono text-[0.68rem] font-semibold">
                          <Sparkles size={11} /> Featured
                        </span>
                      )}
                      <span className="text-muted text-[0.8rem]">· {job.postedDate}</span>
                    </div>

                    <h3 className="mt-1 font-display text-[1.3rem] font-bold text-ink">{job.title}</h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-muted line-clamp-2">{job.summary}</p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.82rem]">
                      <span className="text-acc font-semibold">{job.salary}</span>
                      <span className="text-muted flex items-center gap-1"><MapPin size={13} /> {job.workplace}</span>
                      <span className="rounded-full bg-raised px-2.5 py-0.5 text-body text-[0.75rem]">{job.category}</span>
                    </div>
                  </div>
                </div>

                {/* Requirements & Action */}
                <div className="md:col-span-4 flex flex-col md:items-end justify-between gap-4 border-t hairline pt-4 md:border-t-0 md:pt-0">
                  <div className="hidden lg:block text-right">
                    <span className="text-[0.75rem] text-muted block mb-1">Key Requirement:</span>
                    <span className="text-[0.82rem] text-body block">{job.requirements[0]}</span>
                  </div>
                  <a
                    href={`mailto:${job.applyEmail}?subject=Application%20for%20${encodeURIComponent(job.title)}%20via%20Dubai%20Startups%20Daily`}
                    className="btn-lime text-[0.85rem] py-2 px-4 w-full md:w-auto text-center"
                  >
                    Apply for Role
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-[1.1rem]">No startup roles match your criteria.</p>
            <button
              onClick={() => { setSelectedCat("All"); setSelectedWorkplace("All"); setSearchQuery(""); }}
              className="mt-3 btn-ghost text-[0.85rem]"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Post a Job CTA */}
      <section className="wrap mt-24">
        <div className="rounded-tile bg-raised p-8 sm:p-12 text-center max-w-3xl mx-auto ring-1 ring-line/10">
          <p className="eyebrow">For Founders & Hiring Teams</p>
          <h2 className="display mt-2 text-[2rem] sm:text-[2.6rem]">Hiring for your Dubai Startup?</h2>
          <p className="mt-3 text-[0.98rem] text-muted max-w-xl mx-auto">
            Reach exceptional engineers, product managers, marketers, and operators who follow Dubai Startups Daily every morning.
          </p>
          <a
            href="mailto:jobs@dubaistartupsdaily.ae?subject=Post%20a%20Startup%20Job%20Listing"
            className="btn-lime mt-6 inline-flex"
          >
            Post a Featured Job
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default JobsPage;
