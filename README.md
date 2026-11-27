# Dubai Startups Daily (DSD)

> **Tagline:** The Daily Pulse of Dubai’s Startup Ecosystem.  
> **Brand Message:** *Discover. Connect. Build. Grow.*

**Dubai Startups Daily (DSD)** is a dedicated technology, business, and startup media platform focused on covering the people, companies, ideas, opportunities, and developments shaping Dubai’s startup ecosystem.

Its purpose is to become a trusted destination where founders, entrepreneurs, investors, startup employees, and business professionals can stay informed and connected with Dubai’s growing business community. Built with **React 19 + Vite + Tailwind 3 + Express**.

---

## 1. What Dubai Startups Daily Covers

- **Startup News**: Launches, company announcements, funding rounds, venture capital activity, M&A, partnerships, AI, fintech, SaaS, e-commerce, and regional tech expansions.
- **Startup Events**: Networking events, investor/founder meetups, pitch competitions, demo days, tech conferences, workshops, and accelerator programmes.
- **Business Setup & Entrepreneurship**: Mainland vs. free zone guides, company formation, licensing, business banking, visas, residency, and practical growth manuals.
- **Startup Jobs**: Tech and engineering roles, marketing, sales, product, operations, and startup internships across Dubai.
- **Founder Stories**: In-depth interviews, startup building journeys, failure/pivot lessons, and operational insights from ecosystem leaders.

---

## 2. Who We Serve & Value Proposition

| Audience | What They Gain |
| :--- | :--- |
| **Entrepreneurs** | Practical business knowledge, opportunities, and startup news |
| **Startup Founders** | Visibility, insights, and high-value connections |
| **Investors** | Early visibility into emerging companies and regional deal flow |
| **Professionals** | Startup industry news, career moves, and job opportunities |
| **Aspiring Founders** | Guidance, frameworks, and inspiration to launch a business |
| **Startup Employees** | Career opportunities and ecosystem updates |
| **Business Service Providers** | Targeted visibility among active founders and companies |

---

## 3. What Makes DSD Different

- **Exclusively Dubai:** Dedicated 100% to Dubai's startup ecosystem (companies, founders, DIFC, DMCC, DWTC, DED free zones and mainland licensing) rather than broad international or regional coverage.
- **Startup-Focused:** Concentrates strictly on startups, founders, investors, innovation, and entrepreneurship.
- **Practical Utility:** Combines breaking news with actionable business guides, events, and job opportunities in Dubai.
- **Founder-First Perspective:** Gives entrepreneurs and startup leaders building in Dubai a platform to share their genuine stories.
- **Ecosystem-Wide Connection:** Connects all parts of Dubai's startup community through one modern media brand.
- **Trustworthy Journalism:** Prioritises verified funding figures (confirmed with companies or deal participants), transparent sponsored labels, and clear public corrections.

---

## 4. The Five Main Content Pillars

1. **Daily Startup News**: Breaking developments, funding, launches, technology, and business news.
2. **Startup Events**: Destination for discovering conferences, networking, workshops, and gatherings.
3. **Business Setup & Guides**: Essential information for establishing, operating, and scaling a business in Dubai.
4. **Startup Jobs**: Career opportunities and hiring updates from Dubai-based startup companies.
5. **Founder Stories**: Genuine stories, interviews, experiences, and insights from people building businesses in Dubai.

---

## 5. Business & Commercial Value

- **Media & Advertising**: Brand visibility and targeted advertising placements.
- **Sponsored Content**: Clearly labelled sponsored articles, company profiles, and custom campaigns.
- **Business Setup Partnerships**: Exposure and qualified enquiries for formation and corporate service providers.
- **Job Listings**: Paid recruitment listings and featured hiring spotlights.
- **Event Promotion**: Visibility, media partnerships, and ticket campaigns for startup summits.
- **Newsletter Sponsorships**: Brand exposure to an engaged daily executive readership.

---

## 6. Brand Identity

- **Brand Name**: Dubai Startups Daily
- **Abbreviation**: DSD
- **Tagline**: *The Daily Pulse of Dubai’s Startup Ecosystem.*
- **Brand Message**: *Discover. Connect. Build. Grow.*
- **Mission**: To inform, connect, and empower Dubai's startup community through reliable news, practical business insights, founder stories, events, and opportunities.
- **Vision**: To become one of the most trusted and recognised media platforms covering Dubai's startup and entrepreneurship ecosystem.
- **Brand Personality**: Professional, modern, credible, ambitious, entrepreneurial, and community-driven.

---

## Run

```bash
npm install
npm run dev      # site on http://localhost:5173 + CMS API on :8787
npm run build    # production build in dist/
npm start        # one server: built site + API + uploads on :8787
```

## CMS

Open **/admin** and sign in. Default dev password: `dsd-admin`.

- Create, edit and delete stories: headline, summary, block body (paragraph / heading / quote), section, author, date, read time (auto), slug (auto from headline), cover image (upload or URL), caption, topics.
- **Lead story** puts a story in the home-page hero (only one at a time). **Most read** pins it to the Most read list.
- `Ctrl+S` saves; leaving with unsaved changes asks first.

How it works:

- `server/` is a small Express app. Stories live in `server/data/content.json` (seeded from `src/data/stories-*.js` on first run); uploads go to `server/data/uploads/`. Both are git-ignored runtime data, so back up that folder.
- The site loads `/api/articles` at startup and falls back to the bundled stories if the API is unreachable.
- Auth is a single admin password with signed 12-hour tokens and a login rate limit.

Before deploying, set:

| Variable          | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `ADMIN_PASSWORD`  | Admin login password (required in production)   |
| `SESSION_SECRET`  | Token signing secret (optional, recommended)    |
| `PORT`            | Server port (default 8787)                      |
| `DSD_DATA_DIR`    | Where content + uploads are stored              |

## Design system

Bold tech-media look: dark-first, big grotesk headlines, rounded image tiles, one electric-lime accent.

| Token     | Dark      | Light     | Use                                   |
| --------- | --------- | --------- | ------------------------------------- |
| `bg`      | `#0C0D0B` | `#F0EFE8` | Page background                       |
| `surface` | `#161714` | `#FAFAF6` | Cards, panels                         |
| `raised`  | `#21221E` | `#E4E3DA` | Inputs, image placeholders            |
| `ink`     | `#F3F2EB` | `#0E0F0C` | Headlines                             |
| `body`    | `#C4C5BB` | `#34352F` | Running text                          |
| `muted`   | `#8A8B80` | `#707167` | Meta, captions                        |
| `lime`    | `#CEF252` | `#CEF252` | Fills: chips, buttons, highlights     |
| `acc`     | `#CEF252` | `#547400` | Accent *text* (readable on each bg)   |

Tokens are RGB triplets in `src/index.css`, mapped in `tailwind.config.js`, so opacity modifiers (`bg-ink/10`) work and dark mode needs no `dark:` variants.

**Type:** Bricolage Grotesque (display), Geist (UI and body), Geist Mono (dates, figures).

**Theme:** dark by default; the switch in the header stores `light` in `localStorage` (`dsd_theme`), applied before first paint by an inline script in `index.html`.

**Home page:** hero tiles → "By the numbers" rail (`FIGURES` in `src/data/articles.js`, each linked to its story) → Latest list + Most read → tabbed section explorer → newsletter → founders rail.

**Keyboard:** `/` opens search, `Esc` closes overlays, skip-link on first Tab.
