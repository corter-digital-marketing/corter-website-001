# Corter Digital website

Marketing agency site. Offers: **websites** and **social media** (done-for-you), plus **online courses and digital products** (learn it yourself).

## Positioning & copy rules
- **No regional references.** Never mention PA, NEPA, Northeastern PA, "local", or a service area. The agency is positioned for online growth, not a region.
- Voice: confident, short, outcome-focused. Two or three short lines beat one long sentence. No buzzwords.
- Case studies are titled by **outcome**, not client name (e.g. "250K views in 30 days for an antique shop").
- Never invent results, testimonials, prices, timelines, guarantees or founder facts. Missing content gets a visible `<Placeholder>` slot.
- Real facts available: 10M+ views and 60K+ followers gained (across all platforms), 250K+ Facebook views in 30 days for Finding Treasures 4 U, pricing on `/websites` and `/social-media`, phone (570) 502-4036, email andrewcsmma@gmail.com, "No pitch. Just a straight conversation."

## Design direction
Cinematic, serious, high-budget tech feel (inspired by Anduril) with punchy agency energy (inspired by The Sulfur Group). Inspiration only; never copy layouts or assets.
- Dark, full-bleed sections. Hero is full-screen media with a dark overlay and a huge headline.
- Oversized, tight headlines in the display font. Type does the work, not decoration.
- Small uppercase **monospace labels** with wide tracking above headings and on cards: `01 / SERVICES`, `CASE STUDY`, `EST. 2025`.
- Thin 1px lines and bordered grids, strict alignment. **No** heavy shadows, bubbly rounded cards, or gradients everywhere. Corners are sharp (`rounded-none`) or at most `rounded-sm` (2px).
- Large media-led cards for services, work and courses: art/image fills the card, text overlaid at the bottom or directly below.
- Services and FAQs use accordions (`<Accordion>`).

## Color tokens (brand colors come from the original site: do not add new brand colors)
Defined in `src/styles/global.css` under `@theme` (Tailwind 4 has no tailwind.config.js).

| Token | Hex | Use |
|---|---|---|
| `brand-blue` | `#2F7DF6` | Accents: labels, highlights, focus, hover |
| `brand-blue-600` | `#1E5FD1` | Primary button fill (white text passes AA) |
| `brand-blue-700` | `#0E5BCF` | Pressed / deep accent |
| `ink` | `#F3EFE8` | Primary text |
| `ink-soft` | `#F5F2EC` | Text on darkest bands |
| `base` | `#121009` | Page background |
| `surface` | `#1D1A17` | Alternate sections |
| `surface-2` | `#262220` | Cards / panels |
| `surface-3` | `#2E2925` | Raised / hover |

Allowed extras: black overlays and transparency of the above (e.g. `text-ink/60`, `border-ink/10`, `bg-brand-blue/15`). Smallest muted text is `text-ink/60` or brighter (contrast).

## Fonts (self-hosted via Fontsource npm packages)
- Display: **Archivo** variable, condensed (`font-stretch: 82%`), weight 600–700, tracking −0.035em → `font-display`
- Body: **Inter** variable → `font-sans`
- Labels: **IBM Plex Mono** 400/500, uppercase, tracking 0.18em → `font-mono` / `.label`

## Tech stack
- Astro 7 (static output), `<ClientRouter />` view transitions
- Tailwind CSS 4 via `@tailwindcss/vite`; tokens + component classes in `src/styles/global.css`
- GSAP 3 (ScrollTrigger, SplitText) + Lenis smooth scroll, all in `src/scripts/motion.ts`
- UI behavior (nav, menu, accordions, filters, forms, counters) in `src/scripts/ui.ts`
- Forms: Formspree endpoint `https://formspree.io/f/mwvzvkaw` (contact + waitlist)
- Content collections: `src/content/case-studies`, `src/content/courses`, `src/content/articles` (schemas in `src/content.config.ts`)
- Deploy: Netlify (`netlify.toml` holds build settings + 301 redirects from old `.html` URLs)

## Component rules
- Every page uses `BaseLayout` (head/meta, Nav, Footer, scripts). Each page passes a unique `title` and `description`.
- Reuse components in `src/components/` before writing new markup: `Button`, `SectionLabel`, `PageHero`, `HeroMedia`, `MediaCard`, `ArtVisual`, `Accordion`/`AccordionItem`, `StatCounter`, `Testimonial`, `CourseCard`, `CaseStudyCard`, `CtaBanner`, `ContactForm`, `WaitlistForm`, `Placeholder`, `Icon`.
- Sections: `<section>` with a `SectionLabel` (`NN / NAME`), an oversized heading, content. Separate sections with 1px `border-ink/10` lines.
- Motion via data attributes only (no inline GSAP in pages):
  - `data-split` headline line reveal (`data-split="load"` for above-the-fold)
  - `data-reveal` fade/slide up, `data-stagger` on a parent to stagger children
  - `data-reveal-img` clip/scale image reveal
  - `data-count="10" data-suffix="M+"` count-up
  - `data-pin-steps` pinned process section (desktop only)
- All motion must be disabled under `prefers-reduced-motion` (the `html.motion` class is only added when motion is allowed; hidden initial states are scoped to it).
- Accessibility: semantic landmarks, one `h1` per page, labelled form fields, visible focus rings (`focus-visible:outline-brand-blue`), alt text on meaningful images, `aria-hidden` on decorative art.
- Test at 375px, 768px, 1440px. `npm run build` must pass with zero errors, and every internal link must resolve.

## Old site
The pre-Astro HTML files (`*.html`, `styles.css`, `main.js` in the project root) are kept until the owner approves deleting them. Astro ignores them (only `public/` is copied to the build).
