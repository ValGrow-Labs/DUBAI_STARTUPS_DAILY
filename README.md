# Dubai Startups Daily

Startups, funding, AI and the founders building Dubai and the UAE. React 19 + Vite + Tailwind 3.

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
