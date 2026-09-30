# Corter Digital website

The corterdigital.com site, built with Astro. This guide assumes you are not a developer. Copy the commands exactly.

---

## 1. One-time setup

1. Install **Node.js LTS** from https://nodejs.org (click the big "LTS" button and run the installer with default options).
2. Open this project folder in VS Code.
3. Open a terminal in VS Code: **Terminal → New Terminal**.
4. Run:
   ```
   npm install
   ```
   This downloads everything the site needs (it takes a minute). You only do this once, or again after pulling changes that add packages.

## 2. See the site on your computer

```
npm run dev
```

Open **http://localhost:4321** in your browser. The page updates live as you edit files. Press `Ctrl + C` in the terminal to stop it.

To check the site builds cleanly before publishing:

```
npm run build
```

If it ends with "Complete!" you're good. If it prints an error, it names the file and line.

---

## 3. Where things live

| What | Where |
|---|---|
| Page text and layout | `src/pages/` (`index.astro` is the homepage, `websites.astro` is /websites, etc.) |
| Case studies | `src/content/case-studies/` (one file per project) |
| Courses & products | `src/content/courses/` (one file per product) |
| Images for case studies/courses | `src/assets/work/` |
| Hero video | `public/video/` |
| Colors, fonts, spacing | `src/styles/global.css` (see `CLAUDE.md` for the rules) |

---

## 4. Add a case study

1. Copy an existing file in `src/content/case-studies/`, for example `foundedceo.md`, and rename the copy (lowercase, dashes, e.g. `acme-plumbing.md`).
2. Edit the fields between the `---` lines:
   ```yaml
   title: "Double booked calls for a plumbing company in 60 days"   # the OUTCOME, not the client name
   client: "Acme Plumbing"
   service: "websites"            # or "social-media"
   industry: "Plumbing"
   summary: "One sentence on what we did."
   result: "2x booked calls in 60 days"   # the key number (delete the line to show a placeholder)
   stat: "2x"                     # optional big number on the card
   statLabel: "Booked calls"      # label under the big number
   image: "../../assets/work/acme.png"    # optional: put the image in src/assets/work first
   imageStyle: "photo"            # "photo" fills the tile, "logo" sits on a light tile
   link: "https://acmeplumbing.com"
   featured: true                 # show on the homepage
   order: 6                       # lower numbers appear first
   ```
3. Save. It appears on **/portfolio** automatically (and on the homepage if `featured: true`).

**To fill in the missing results** on the existing projects, open each file and replace the commented `# result:` line with a real one (remove the `#`).

## 5. Courses (paused)

Courses are hidden for now: there is no /courses page and no link to it. The course content is still saved in `src/content/courses/`. To bring courses back, ask Claude to "restore the courses page" (it's in the git history), or restore `src/pages/courses.astro` yourself, add Courses back to the menu and footer, and delete the `/courses` redirect in `netlify.toml`.

## 6. Add the hero video

Put these three files in `public/video/` (create the folder if it's missing), with exactly these names:

| File | What | Target size |
|---|---|---|
| `hero.mp4` | Desktop version, 1920px wide, 10–20 seconds, no audio | 4–8 MB |
| `hero-mobile.mp4` | Phone version, 720px wide | 1.5–3 MB |
| `hero-poster.jpg` | A still of the first frame | under 250 KB |

The site uses them automatically. Nothing else to change.

**Compressing footage (free):** easiest is **HandBrake** (handbrake.fr): preset "Web → Creator 1080p60", untick audio, and set the quality slider (RF) around 26–28 until the file is in the size range above. Or, if you have ffmpeg:

```
ffmpeg -i raw.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart public/video/hero.mp4
ffmpeg -i raw.mov -an -vf "scale=720:-2,fps=30" -c:v libx264 -crf 30 -preset slow -movflags +faststart public/video/hero-mobile.mp4
ffmpeg -i public/video/hero.mp4 -frames:v 1 -q:v 4 public/video/hero-poster.jpg
```

The video only loads after the page is ready, pauses when scrolled off screen, and is skipped for visitors with Data Saver or reduced motion (they see the poster). This keeps phone performance high.

## 7. Replace placeholders

Anything still to supply shows a dashed outline and a "To supply" label on the site:

- **Testimonial** (homepage): in `src/pages/index.astro`, replace `<Testimonial />` with
  `<Testimonial quote="What they said." name="Their Name" role="Owner, Their Business" />`
- **Founder photo and bio** (About): in `src/pages/about.astro`. Put the photo in `src/assets/`, import it at the top (`import photo from '../assets/founder.jpg';`), and pass `image={photo}` to the `MediaSlot`. Replace the bracketed bio text.
- **Case study results:** see section 4.

---

## 8. Forms

Both the contact form and the course waitlist send to your existing Formspree form (`mwvzvkaw`), so messages arrive in the same inbox as before. Waitlist signups have the subject **"Waitlist: [course name]"**. Nothing to set up. To see or export submissions, log in at https://formspree.io.

---

## 9. Publish to Netlify (step by step)

The code is on GitHub at `corter-digital-marketing/corter-website-001`. The new site is on the **`redesign`** branch.

**First time:**
1. Merge `redesign` into `main` once you're happy (or ask Claude to open a pull request).
2. Go to https://app.netlify.com and sign up / log in **with GitHub**.
3. Click **Add new site → Import an existing project → GitHub**.
4. Pick **corter-website-001**. Branch to deploy: **main**.
5. Netlify reads `netlify.toml` and fills in the settings (build command `npm run build`, publish directory `dist`). Click **Deploy**.
6. Wait about a minute. You get a temporary address like `something.netlify.app`. Check it.

**Connect corterdigital.com:**
1. In Netlify: **Site configuration → Domain management → Add a domain** → type `corterdigital.com`.
2. Netlify shows DNS records. At your domain registrar (where you bought the domain), either switch the nameservers to Netlify's, or add the records Netlify lists.
3. HTTPS turns on automatically once DNS updates (minutes to a few hours).

**After that:** every time changes are pushed to `main`, Netlify rebuilds and publishes the site automatically.

**Old links keep working:** `netlify.toml` permanently redirects the old addresses (`/websites.html`, `/about.html`, etc.) to the new ones, and the old Learn page to Courses, so you keep your search rankings.

---

## 10. Old site files

The old site's files (`index.html`, `websites.html`, `styles.css`, `main.js`, `partnerLogos/`, etc. in the project root) are still here and are **not** used by the new site. Once the new site is live and you're happy, they can be deleted.
