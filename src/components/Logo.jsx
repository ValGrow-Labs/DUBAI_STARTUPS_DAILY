/**
 * Brand mark: three rising towers, the tallest ending in a spire.
 * Reads as a Dubai skyline and a growth chart at once.
 */
export const LogoMark = ({ size = 34, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    aria-hidden="true"
    className={`shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] group-hover:-rotate-6 group-hover:scale-105 ${className}`}
  >
    <rect width="40" height="40" rx="11" fill="rgb(var(--lime))" />
    <g fill="rgb(var(--onlime))">
      <rect x="9" y="22" width="5.5" height="10" rx="1.2" />
      <rect x="16.5" y="16" width="5.5" height="16" rx="1.2" />
      <path d="M24 32V15.5L26.75 7l2.75 8.5V32z" />
    </g>
    <circle cx="26.75" cy="5.6" r="1.25" fill="rgb(var(--onlime))" />
  </svg>
);

const Logo = ({ size = "md" }) => {
  const big = size === "lg";
  return (
    <span className="group inline-flex items-center gap-2.5">
      <LogoMark size={big ? 48 : 34} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-[-0.035em] text-ink whitespace-nowrap ${
            big ? "text-[1.6rem]" : "text-[1.05rem] sm:text-[1.12rem]"
          }`}
        >
          Dubai Startups
        </span>
        <span
          className={`mt-[3px] flex items-center gap-1.5 font-mono font-medium uppercase text-muted ${
            big ? "text-[0.72rem] tracking-[0.28em]" : "text-[0.56rem] tracking-[0.3em]"
          }`}
        >
          <span className="h-px w-3 bg-acc" />
          Daily
        </span>
      </span>
    </span>
  );
};

export default Logo;
