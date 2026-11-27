import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter sign-up. Front-end only: validates and confirms inline. */
const Briefing = ({ variant = "band" }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | error | done
  const id = `brief-${variant}`;
  const onLime = variant === "band";

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) return setState("error");
    setState("done");
  };

  const form =
    state === "done" ? (
      <p role="status" className={`flex items-center gap-2.5 text-[1rem] font-medium ${onLime ? "text-onlime" : "text-ink"}`}>
        <span className={`grid h-7 w-7 place-items-center rounded-full ${onLime ? "bg-onlime text-lime" : "bg-lime text-onlime"}`}>
          <Check size={15} strokeWidth={2.5} />
        </span>
        You’re in. The first briefing lands at 7am Dubai time.
      </p>
    ) : (
      <form onSubmit={submit} noValidate>
        <div className={`flex flex-col sm:flex-row gap-2 rounded-[1.75rem] sm:rounded-full p-1.5 ${onLime ? "bg-onlime/[0.08]" : "bg-surface ring-1 ring-line/10"}`}>
          <label htmlFor={id} className="sr-only">Email address</label>
          <input
            id={id}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            placeholder="you@company.ae"
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? `${id}-err` : undefined}
            className={`min-w-0 flex-1 bg-transparent px-4 py-3 text-[0.98rem] outline-none ${
              onLime ? "text-onlime placeholder:text-onlime/50" : "text-ink placeholder:text-muted"
            }`}
          />
          <button type="submit" className={`group ${onLime ? "btn bg-onlime text-lime hover:bg-white hover:text-onlime" : "btn-lime"}`}>
            Subscribe
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
        {state === "error" && (
          <p id={`${id}-err`} className={`mt-2.5 pl-4 text-[0.84rem] font-medium ${onLime ? "text-onlime" : "text-acc"}`}>
            That doesn’t look like a full email address. Try name@company.ae.
          </p>
        )}
      </form>
    );

  if (variant === "inline") {
    return (
      <div className="rounded-tile bg-surface p-6 sm:p-8 ring-1 ring-line/10">
        <p className="eyebrow">Weekdays · 7am</p>
        <p className="display mt-2 text-[1.7rem] leading-[1.02]">Every Dubai deal, before your first coffee.</p>
        <p className="mt-2 mb-5 text-[0.93rem] leading-relaxed text-muted">
          The Morning Briefing: disclosed funding rounds plus the three stories worth your time.
        </p>
        {form}
      </div>
    );
  }

  return (
    <section className="wrap py-6" aria-labelledby="briefing-heading">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-lime px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full border-[3.5rem] border-onlime/[0.06]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-24 top-40 h-40 w-40 rounded-full bg-onlime/[0.05]" />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.08em] text-onlime/70">The Morning Briefing</p>
            <h2
              id="briefing-heading"
              className="mt-3 font-display text-[2.5rem] sm:text-[3.6rem] lg:text-[4.4rem] font-extrabold leading-[0.94] tracking-[-0.035em] text-onlime"
              style={{ fontVariationSettings: '"opsz" 40' }}
            >
              Know every deal before your first meeting.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="mb-5 max-w-md text-[1rem] leading-relaxed text-onlime/80">
              Every disclosed funding round in Dubai, plus the reporting that explains it. Five minutes, weekdays.
            </p>
            {form}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Briefing;
