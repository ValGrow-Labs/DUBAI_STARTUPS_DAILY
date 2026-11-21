import { MoreLink } from "./ArticleCard";

const SectionHead = ({ eyebrow, title, to, linkLabel, testid, id, children }) => (
  <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="display mt-2 text-[2.2rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95]">
        {title}
      </h2>
    </div>
    {children}
    {to && (
      <MoreLink to={to} testid={testid}>
        {linkLabel}
      </MoreLink>
    )}
  </div>
);

export default SectionHead;
