# Corter Digital website

Marketing agency site. Offers: **websites** and **social media** (done for you), plus **courses and digital products** (do it yourself).

Target feel: a minimal, precise, expensive technical company (Anduril, Vercel, Linear, Palantir). It must not look AI-generated or templated.

## Positioning & copy
- **No regional references.** Never mention PA, NEPA, Northeastern PA, "local", coordinates or a service area. Metadata uses non-regional values (Est. 2025, Rev. YYYY.MM, indices, categories).
- Short, specific, plain. Real numbers. If a sentence could be on any agency's site, rewrite it so it could only be on this one.
- Banned words: elevate, unlock, seamless, supercharge, empower, cutting-edge, game-changing, journey, leverage, "next level", "built right".
- Case studies are titled by outcome, not client.
- Never invent results, testimonials, prices, timelines, guarantees, team size or founder facts. Missing content = a visible `.slot` placeholder.
- Real facts: 10M+ views and 60K+ followers gained (all platforms combined), 250K+ Facebook views in 30 days for Finding Treasures 4 U, prices on /websites and /social-media, phone (570) 502-4036, email andrewcsmma@gmail.com, "No pitch. Just a straight conversation."

## Grid (the structure everything hangs on)
- One 12-column frame, max 1440px, outer margin `--margin`. **4 columns below 1024px.**
- Columns have no gutters. 1px hairlines sit on every column boundary (`.grid-lines` in BaseLayout, absolute over the full page height, behind content).
- Content is inset from its gridline by `--pad` (`.cell`). Text starts at a line + pad, always.
- Sections are full-bleed bands separated by a 1px top rule (`.band`). Sections share borders; nothing floats as a separate card with gaps.
- Use `.grid-12` with Tailwind `col-span-*` / `lg:col-span-*` / `lg:col-start-*`. Mobile spans are out of 4.
- "+" registration marks (`.marks` on a band) only on 2–3 major intersections per page.
- Every section starts with a metadata row: `<Section n="02" name="Services" meta="3 plans">` or `<Index>`.

## Layout rules
- Left-aligned, asymmetric, editorial. Headlines span 7–10 columns; body text sits in narrower offset columns (e.g. `lg:col-span-4 lg:col-start-8`). Center only rare single statements.
- No two consecutive sections share a layout. Rotate: full-bleed media, dense data row (`Stat`), index list (`IndexRow`), columns, statement alone in open space, split (text | accordion / form / media), spec table (`PricingTable`).
- Lists of services/cases/values are `IndexRow`s (`01  Title  description  meta  →`), never icon-card grids.
- Generous negative space. Remove anything that doesn't earn its place.

## Typography
- **Geist** (sans) and **Geist Mono** (labels, metadata, buttons). Self-hosted via Fontsource.
- Exactly **5 sizes** (Tailwind's scale is removed; only these utilities exist):
  `text-display` (hero / closing / big stats) · `text-heading` (section headings, row titles) · `text-body` · `text-small` · `text-label` (mono, uppercase, tracked).
- Exactly **2 weights**: 400 (`font-normal`) and 500 (`font-medium`).
- Tight tracking on display/heading (built into the tokens); wide tracking on mono labels (`.label`). Tabular numerals on every number (`.num`).

## Color & surfaces
Tokens in `src/styles/global.css` `@theme`. Brand colors come from the original site; do not add new ones.

| Token | Hex | Use |
|---|---|---|
| `base` | `#121009` | Page background (everything) |
| `surface` | `#1D1A17` | Media/placeholder fills only |
| `ink` | `#F3EFE8` | Text; logo tiles |
| `line` / `line-strong` | ink @ 9% / 18% | Hairlines, dashed slots |
| `brand-blue` | `#2F7DF6` | Rare highlight (max 1–2 per page), active nav/filter rule |
| `brand-blue-600` | `#1E5FD1` | Primary button fill |
| `brand-blue-700` | `#0E5BCF` | Primary button hover |

- Mostly monochrome. Brand blue only on: the primary CTA, active states, and one or two highlights per page.
- **No shadows. No gradients** except a single flat dark overlay on media for legibility. No blur/backdrop-filter.
- Corners: sharp, `rounded-sm` (2px) max.

## Motion
Only four things animate (`src/scripts/motion.ts`), all disabled under `prefers-reduced-motion`:
1. `data-split` — the page's hero headline, line by line on load
2. `.grid-lines` — hairlines draw in on the first page load of a visit
3. `data-reveal-img` — media clip reveal on scroll
4. `data-count` — stat counters
Easing: `--ease-precise` `cubic-bezier(.7,0,.2,1)` / GSAP `precise`, and `settle` for outs. No bounce, no overshoot, no pulsing.
Hover: underline draws in (`.u-link`), arrow shifts 3px (`.arrow`), media scales 2% (`.media`). Nothing else.

## Banned patterns (the audit list)
Gradient text · glowing blobs/orbs · radial color washes · glassmorphism/backdrop blur · pill badges with emoji/sparkles · pulsing/bouncing dots · rows of identical icon cards · icon-in-rounded-square · decorative dot/grid/stripe backgrounds not aligned to the real grid · corner-tick ornaments · filler illustrations (fake browsers, phones, rising charts) · "Fig. 01" captions on fake art · bright-line/dim-line headline trick · every section using label → headline → subhead → cards · uniform large radii · drop shadows · cards with border + shadow + background · fade-up on every element · generic icons as decoration · more than 5 sizes or 2 weights · buzzword copy.

## Tech stack
- Astro 7 (static), `<ClientRouter />` view transitions, Tailwind CSS 4 (`@tailwindcss/vite`), GSAP 3 (ScrollTrigger, SplitText, CustomEase), Lenis
- UI behavior in `src/scripts/ui.ts` (header, dropdown, mobile menu, accordions, filters, forms, hero video). Re-runs on `astro:page-load`.
- Forms: Formspree `https://formspree.io/f/mwvzvkaw` (contact + waitlist, waitlist tagged via `_subject`)
- Content collections (`src/content.config.ts`): `case-studies`, `courses`, `articles`
- Hero footage: drop `hero.mp4`, `hero-mobile.mp4`, `hero-poster.jpg` in `public/video/` (see README)
- Deploy: Netlify (`netlify.toml`: build, 301s from old `.html` URLs, caching)

## Components (`src/components`)
`Section`, `Index`, `PageHero`, `HeroMedia`, `MediaSlot`, `Stat`, `IndexRow`, `Accordion`/`AccordionItem`, `PricingTable`, `CaseStudyCard`, `CourseCard`, `Testimonial`, `Closing`, `ContactForm`, `WaitlistForm`, `Button`, `Nav`, `Footer`. Reuse before writing new markup.

## Verification (every page)
`npm run build` with zero errors; all internal links and anchors resolve; unique title + description; one `h1`; screenshots at 375 / 768 / 1440 reviewed against the banned-patterns list; Lighthouse mobile ≥ 90.

## Old site
Pre-Astro files in the project root (`*.html`, `styles.css`, `main.js`, loose images) are kept until the owner approves deleting them. Astro ignores them.
