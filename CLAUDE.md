# Corter Digital website

Marketing agency site. Offers three done-for-you services, each with exactly two options, plus courses (do it yourself):
- **Websites**: Template build · Custom build (+ website maintenance)

**No prices or packages anywhere on the site** (owner's request, 2026-09-30). No dollar amounts, no tiers (Launch/Growth/Scale, Essentials/Priority…), no "from $X", no price slots. Every option leads to "Get a quote".
- **Social Media**: Management · Content creation
- **SEO**: The Basics (Google and Bing) · AI Fundamentals (ChatGPT, Claude, Gemini)
- **Courses: paused** (owner's request, 2026-09-30). The /courses page and its nav/footer links are removed; `CourseCard`, `WaitlistForm` and `src/content/courses/` are kept for when it returns (restore `src/pages/courses.astro` from git, re-add the nav/footer links, and remove the `/courses` redirect in `vercel.json`).

## Live-site parity (owner's request, 2026-09-30)
Every page keeps the **same layout and information as the live corterdigital.com** (the pre-Astro HTML on `main`, commit `3b4f2c3`), recreated in this style. Exceptions the owner chose: no NEPA/PA wording; homepage headline is "Proven solutions to help grow your business."; no "Products coming soon" sections; SEO and Courses are extra pages (SEO also appears as a third Services card on the homepage).
- Home: centered logo (no wordmark) → headline centered across the full width → stats panel centered below it (10M+ views achieved, 60K+ followers gained, *across all social medias combined, "Speak to a professional") → Services cards (View more) + "Looking for something that's not listed here? We take on custom work too." → "Let's talk about your business." + form + phone/email.
- Websites: "Built. Hosted. Cared for." → Website build (Template / Custom) → Website maintenance (Care) → Websites we've built → "Ready to get your site online?"
- Social Media: "Grow the right way." → What we offer (Social media management · Content creation) → (no results section, owner's request) → "Ready to grow your following?"
- Our Work: Websites grid only (no Social Media section, owner's request) → "Ready to add your business to this list?"
- Learn: **removed** (owner's request). `/learn` and `/learn.html` 301 to `/`. Courses page has no "How it works" section.
- About: "Elevate your business." (live copy, kept on purpose) → stats → contact links.
- Contact: "Let's build something great." → Reach us directly + Send us a message.
- Case study cards show client name, industry and the live description (not outcome titles).

Target feel: a minimal, precise, expensive technical company (Anduril, Vercel, Linear, Palantir). It must not look AI-generated or templated.

## Easy to use comes first (owner's request)
Many visitors are older business owners. Simplicity beats cleverness:
- **Navigation:** every service is a top-level link (Websites, Social Media, SEO, Our Work, About; no Learn, no Courses). No dropdowns. Phone number always visible in the header; on phones, a phone icon button and a three-line menu icon (turns into an X). The menu is one plain list of six links in large text, then one "Get a free quote" button and the phone number. No descriptions or group labels.
- **Pages:** breadcrumb (Home › Page) at the top of every inner page; every option has a real "Get a quote" button.
- **Plain words:** section headings are plain names ("How it works", "Common questions"), not numbered codes. No jargon metadata (no "Index 00", "Rev.", "Case 01"). Clever headlines lose to clear ones.
- **Readable:** body 18px, small 16px; buttons and form labels in normal-case sans, not tiny uppercase mono. Mono labels only for minor metadata. Muted text at ≥78% opacity.
- Every clickable row or card shows a visible arrow or button, on phones too.

## Positioning & copy
- **No regional references.** Never mention PA, NEPA, Northeastern PA, "local", coordinates or a service area. Metadata uses non-regional values (Est. 2025, Rev. YYYY.MM, indices, categories).
- Short, specific, plain. Real numbers. If a sentence could be on any agency's site, rewrite it so it could only be on this one.
- Banned words: elevate, unlock, seamless, supercharge, empower, cutting-edge, game-changing, journey, leverage, "next level", "built right".
- Never invent results, testimonials, prices, timelines, guarantees, team size or founder facts. Missing content = a visible `.slot` placeholder.
- Stat rows show only **10M+ total views** and **60K+ followers**. The 250K Finding Treasures figure is **not shown anywhere** (owner's request).
- Real facts: 10M+ views and 60K+ followers gained (all platforms combined), phone (570) 502-4036, email andrewcsmma@gmail.com, "No pitch. Just a straight conversation."

## Grid (the structure everything hangs on)
- One 12-column frame, max 1440px, outer margin `--margin`. **4 columns below 1024px.**
- Columns have no gutters. **No vertical column lines** (the owner asked for them to be removed); structure comes from horizontal hairlines and alignment. Vertical rules appear only as explicit cell borders where two cells meet (e.g. case study grid).
- Content is inset from its gridline by `--pad` (`.cell`). Text starts at a line + pad, always.
- Sections are full-bleed bands separated by a 1px top rule (`.band`). Sections share borders; nothing floats as a separate card with gaps.
- Use `.grid-12` with Tailwind `col-span-*` / `lg:col-span-*` / `lg:col-start-*`. Mobile spans are out of 4.
- "+" registration marks (`.marks` on a band) only on 2–3 major intersections per page.
- Every section starts with a big bold title via `<Section name="Website build" meta="one-line intro">`. No small header strips, no numbering, no "+" marks on service pages.
- **Service pages are deliberately minimal:** hero → one section per offering (title, one-line intro, option rows via `OptionList`: name + one line · what it includes · Get a quote) → work/results → closing. No column-header rows, bullets, statements or process blocks.

## Layout rules
- Left-aligned, asymmetric, editorial. Headlines span 7–10 columns; body text sits in narrower offset columns (e.g. `lg:col-span-4 lg:col-start-8`). Center only rare single statements.
- No two consecutive sections share a layout. Rotate: full-bleed media, dense data row (`Stat`), index list (`IndexRow`), columns, statement alone in open space, split (text | accordion / form / media), option list (`OptionList`).
- Lists of services/cases/values are `IndexRow`s (`01  Title  description  meta  →`), never icon-card grids.
- Generous negative space. Remove anything that doesn't earn its place.

## Typography
- **Geist** (sans) and **Geist Mono** (labels, metadata, buttons). Self-hosted via Fontsource.
- Exactly **5 sizes** (Tailwind's scale is removed; only these utilities exist):
  `text-display` (hero / closing / big stats) · `text-heading` (section headings, row titles) · `text-body` · `text-small` · `text-label` (mono, uppercase, tracked).
- **3 weights**: 400 (`font-normal`), 500 (`font-medium`), and 600 (`font-semibold`) for section titles and option names only.
- Section titles (`<Section name=...>`) are `text-heading font-semibold`, the biggest thing in a section, so sections are easy to tell apart. Option names and prices inside a section are `text-body font-semibold`.
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
Only three things animate (`src/scripts/motion.ts`), all disabled under `prefers-reduced-motion`:
1. `data-split` — the page's hero headline, line by line on load
2. `data-reveal-img` — media clip reveal on scroll
3. `data-count` — stat counters
Easing: `--ease-precise` `cubic-bezier(.7,0,.2,1)` / GSAP `precise`, and `settle` for outs. No bounce, no overshoot, no pulsing.
Hover: underline draws in (`.u-link`), arrow shifts 3px (`.arrow`), media scales 2% (`.media`). Nothing else.

## Banned patterns (the audit list)
Gradient text · glowing blobs/orbs · radial color washes · glassmorphism/backdrop blur · pill badges with emoji/sparkles · pulsing/bouncing dots · rows of identical icon cards · icon-in-rounded-square · decorative dot/grid/stripe backgrounds not aligned to the real grid · corner-tick ornaments · filler illustrations (fake browsers, phones, rising charts) · "Fig. 01" captions on fake art · bright-line/dim-line headline trick · every section using label → headline → subhead → cards · uniform large radii · drop shadows · cards with border + shadow + background · fade-up on every element · generic icons as decoration (exception: monochrome platform marks in `BrandMarks` on /seo, showing where clients get found) · more than 5 sizes or 2 weights · buzzword copy.

## Tech stack
- Astro 7 (static), `<ClientRouter />` view transitions, Tailwind CSS 4 (`@tailwindcss/vite`), GSAP 3 (ScrollTrigger, SplitText, CustomEase), Lenis
- UI behavior in `src/scripts/ui.ts` (header, dropdown, mobile menu, accordions, filters, forms, hero video). Re-runs on `astro:page-load`.
- Forms: Formspree `https://formspree.io/f/mwvzvkaw` (contact + waitlist, waitlist tagged via `_subject`)
- Content collections (`src/content.config.ts`): `case-studies`, `courses`
- Hero footage: drop `hero.mp4`, `hero-mobile.mp4`, `hero-poster.jpg` in `public/video/` (see README)
- Deploy: **Vercel** (the live host). `vercel.json` holds framework/build/output settings, 301s from old `.html` URLs, and caching. Production publishes from `main`; other branches get preview deployments. Never add a `netlify.toml`.

## Components (`src/components`)
`Section`, `Index`, `PageHero`, `BrandMarks`, `HeroMedia`, `MediaSlot`, `Stat`, `IndexRow`, `Accordion`/`AccordionItem`, `OptionList`, `CaseStudyCard`, `CourseCard`, `Testimonial`, `Closing`, `ContactForm`, `WaitlistForm`, `Button`, `Nav`, `Footer`. Reuse before writing new markup.

## Verification (every page)
`npm run build` with zero errors; all internal links and anchors resolve; unique title + description; one `h1`; screenshots at 375 / 768 / 1440 reviewed against the banned-patterns list; Lighthouse mobile ≥ 90.

## Old site
Pre-Astro files in the project root (`*.html`, `styles.css`, `main.js`) are kept until the owner approves deleting them; their images (and original client logos in `photos/partnerLogos/`) live in `photos/`. Astro ignores all of them. The new site's images are in `src/assets/` (optimized at build) and `public/` (favicons). New client logos the owner drops in `photos/partnerLogos/` must be copied into `src/assets/work/` to be used.
