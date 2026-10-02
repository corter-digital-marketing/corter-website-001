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

Courses are hidden for now: there is no /courses page and no link to it. The course content is still saved in `src/content/courses/`. To bring courses back, ask Claude to "restore the courses page" (it's in the git history), or restore `src/pages/courses.astro` yourself, add Courses back to the menu and footer, and delete the `/courses` redirect in `vercel.json`.

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

## 9. Publish on Vercel (step by step)

corterdigital.com is hosted on **Vercel**, connected to the GitHub repo `corter-digital-marketing/corter-website-001`. The new site is on the **`redesign`** branch. The live site publishes from **`main`**.

All the settings Vercel needs are in `vercel.json` (build command `npm run build`, output folder `dist`, framework Astro, redirects, caching). You don't need to type them in anywhere.

**1. Check the preview first**
1. Go to https://vercel.com and open the Corter Digital project.
2. Click **Deployments**. Every push to `redesign` gets its own deployment with a **preview link**. Open the newest one for the `redesign` branch.
3. Click through every page on your computer and your phone. The live site isn't affected by previews.

If the preview still shows the *old* site: open **Settings → Build & Deployment** and make sure **Framework Preset** is **Astro**, and that "Build Command", "Output Directory" and "Install Command" are either left on their defaults or match `vercel.json`. Turn off any manual overrides, then **Redeploy** the preview.

**2. Go live**
1. On GitHub, open a pull request from `redesign` into `main`: https://github.com/corter-digital-marketing/corter-website-001/compare/main...redesign (or ask Claude to do it).
2. Click **Merge pull request**.
3. Vercel sees the change on `main`, builds the site, and publishes it to corterdigital.com automatically, usually within a minute or two. Watch it under **Deployments**.

**If something goes wrong after going live:** in Vercel, open **Deployments**, find the last good production deployment (the old site), click the **⋯** menu, and choose **Promote to Production** (or **Instant Rollback**). The old site is back in seconds.

**After that:** every push to `main` publishes automatically. Pushes to other branches only create previews.

**Old links keep working:** `vercel.json` permanently redirects the old addresses (`/websites.html`, `/about.html`, `/learn.html`, etc.) to the new pages, so you keep your search rankings.

---

## 10. Old site files

The old site's files (`index.html`, `websites.html`, `styles.css`, `main.js` in the project root, and their images in `photos/`) are still here and are **not** used by the new site. Once the new site is live and you're happy, they can be deleted.
