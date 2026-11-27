import { useState, useMemo } from "react";
import { Calendar, MapPin, Clock, Users, ArrowUpRight, Search, Ticket, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { STARTUP_EVENTS, EVENT_CATEGORIES } from "@/data/events";
import { getEventSchema, getBreadcrumbSchema, buildCanonical } from "@/lib/seo";

const EventsPage = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const pageUrl = buildCanonical("/events");
  const breadcrumbItems = [{ name: "Startup Events", path: "/events" }];

  const schemas = [
    getBreadcrumbSchema(breadcrumbItems),
    ...STARTUP_EVENTS.slice(0, 5).map((e) => getEventSchema(e, pageUrl)),
  ].filter(Boolean);

  const filteredEvents = useMemo(() => {
    return STARTUP_EVENTS.filter((e) => {
      const matchesCat = selectedCat === "All" || e.category === selectedCat;
      const matchesSearch =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCat, searchQuery]);

  const featured = STARTUP_EVENTS.find((e) => e.featured) || STARTUP_EVENTS[0];

  return (
    <div data-testid="events-page" className="pb-24">
      <SEO
        title="Dubai Startup & Tech Events Calendar"
        description="Curated calendar of venture pitch nights, angel circles, demo days, and tech summits across Dubai, DIFC, and Internet City."
        canonical={pageUrl}
        keywords={[
          "Dubai startup events",
          "Dubai tech events",
          "Dubai startup conferences",
          "DIFC pitch nights",
          "Dubai founder meetups",
        ]}
        schema={schemas}
      />
      {/* Hero */}
      <section className="wrap pt-10 sm:pt-16">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <p className="eyebrow rise">Ecosystem Calendar</p>
        <h1
          className="display mt-3 max-w-[17ch] text-[2.6rem] sm:text-[4.2rem] lg:text-[5.4rem] leading-[0.93] tracking-[-0.04em] rise rise-1"
          data-testid="events-headline"
        >
          Where Dubai’s founders and capital meet<span className="text-acc">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[1.12rem] leading-relaxed text-body rise rise-2">
          Curated conferences, angel pitch nights, accelerator demo days, and founder meetups across DIFC, Internet City, and Dubai World Trade Centre.
        </p>

        {/* Featured Event Spotlight */}
        {featured && (
          <div className="mt-12 rounded-tile bg-surface p-7 sm:p-10 ring-1 ring-line/10 relative overflow-hidden rise rise-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline pb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1 font-mono text-[0.75rem] font-bold text-onlime">
                <Sparkles size={13} />
                Featured Event
              </span>
              <span className="font-mono text-[0.82rem] text-muted">{featured.organizer}</span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="font-mono text-[0.85rem] font-semibold text-acc">{featured.category}</span>
                <h2 className="display mt-2 text-[2.2rem] sm:text-[2.8rem] leading-tight text-ink">{featured.title}</h2>
                <p className="mt-2 text-[1.05rem] text-body">{featured.tagline}</p>
                <p className="mt-4 text-[0.92rem] leading-relaxed text-muted max-w-2xl">{featured.description}</p>

                <div className="mt-6 flex flex-wrap gap-y-3 gap-x-6 text-[0.88rem] text-body">
                  <span className="flex items-center gap-2">
                    <Calendar size={15} className="text-acc" />
                    <strong>{featured.date}</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={15} className="text-muted" />
                    {featured.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={15} className="text-acc" />
                    {featured.venue}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-4">
                <div className="text-left lg:text-right">
                  <span className="text-[0.82rem] text-muted block">Admission</span>
                  <span className="font-display text-[1.5rem] font-bold text-ink">{featured.price}</span>
                  <span className="text-[0.78rem] text-muted block mt-0.5">{featured.attendees}</span>
                </div>
                <a
                  href={`mailto:events@dubaistartupsdaily.ae?subject=RSVP%20for%20${encodeURIComponent(featured.title)}`}
                  className="btn-lime w-full sm:w-auto text-center"
                >
                  <Ticket size={16} />
                  Register / Get Tickets
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Filter and Search Bar */}
      <section className="wrap mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b hairline pb-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {EVENT_CATEGORIES.map((cat) => (
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

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Filter by keyword or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-surface pl-9 pr-4 py-1.5 text-[0.88rem] text-ink placeholder:text-muted outline-none ring-1 ring-line/10 focus:ring-acc"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt, idx) => (
            <Reveal
              key={evt.id}
              delay={idx * 50}
              className="rounded-card bg-surface p-6 ring-1 ring-line/10 hover:ring-line/25 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.75rem] font-semibold text-acc uppercase tracking-wide">
                    {evt.category}
                  </span>
                  <span className="rounded-[6px] bg-raised px-2 py-0.5 font-mono text-[0.72rem] text-muted">
                    {evt.price}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-[1.35rem] font-bold leading-tight text-ink">{evt.title}</h3>
                <p className="mt-1.5 text-[0.88rem] text-body line-clamp-2">{evt.tagline}</p>

                <div className="mt-5 space-y-2 border-t hairline pt-4 text-[0.84rem]">
                  <div className="flex items-center gap-2 text-ink">
                    <Calendar size={14} className="text-acc shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Clock size={14} className="shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Users size={14} className="shrink-0" />
                    <span>{evt.attendees}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {evt.tags.map((t) => (
                    <span key={t} className="rounded-full bg-raised px-2.5 py-0.5 text-[0.72rem] text-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t hairline flex items-center justify-between">
                <span className="text-[0.78rem] text-muted">{evt.organizer}</span>
                <a
                  href={`mailto:events@dubaistartupsdaily.ae?subject=Inquiry%20for%20${encodeURIComponent(evt.title)}`}
                  className="inline-flex items-center gap-1 font-semibold text-[0.85rem] text-ink hover:text-acc transition-colors"
                >
                  View Details <ArrowUpRight size={14} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-[1.1rem]">No events match your current filter.</p>
            <button
              onClick={() => { setSelectedCat("All"); setSearchQuery(""); }}
              className="mt-3 btn-ghost text-[0.85rem]"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Organizer Submit CTA */}
      <section className="wrap mt-24">
        <div className="rounded-tile bg-raised p-8 sm:p-12 text-center max-w-3xl mx-auto ring-1 ring-line/10">
          <p className="eyebrow">Organizers & Community Leaders</p>
          <h2 className="display mt-2 text-[2rem] sm:text-[2.6rem]">Hosting a Startup Event in Dubai?</h2>
          <p className="mt-3 text-[0.98rem] text-muted max-w-xl mx-auto">
            Get your demo day, pitch competition, or workshop in front of thousands of active founders and investors across Dubai.
          </p>
          <a
            href="mailto:events@dubaistartupsdaily.ae?subject=Submit%20Startup%20Event"
            className="btn-lime mt-6 inline-flex"
          >
            Submit an Event for Free
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
