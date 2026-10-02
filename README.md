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

## 4b. Sell the guide (PDF + Stripe)

The guide is sold with a **Stripe Payment Link**: Stripe hosts the payment page, then sends the buyer to your **/thank-you** page, which has the download button. There is no server code and nothing secret in this project.

Everything about the product is in one file: `src/config/guide.ts` (name, price shown on the site, the Stripe link, and which PDF file is downloaded).

**Set it up (about 10 minutes, start in Test mode)**
1. Log in at https://dashboard.stripe.com. Turn on **Test mode** (toggle, top right).
2. **Product catalog → Add product.** Name: `The 90-Day Social Media Growth Guide for Local Businesses`. Price: `27.00 USD`, **One-off**. Save.
3. On the product, click **Create payment link**.
4. Under **After payment**, choose **Don't show confirmation page → Redirect customers to your website** and enter:
   `https://corterdigital.com/thank-you`
   (While testing on a Vercel preview, use the preview address instead, e.g. `https://your-preview.vercel.app/thank-you`.)
5. Click **Create link** and copy it (it looks like `https://buy.stripe.com/test_...`).
6. Open `src/config/guide.ts` and paste it between the quotes on the `paymentLink:` line. Save, commit, push.

**Test it**
- Open the guide page, click **Buy now**, and pay with Stripe's test card: `4242 4242 4242 4242`, any future expiry date, any 3-digit CVC, any ZIP.
- You should land on the thank-you page. Click **Download Your Guide** and check the PDF opens.
- Click the back arrow on Stripe's payment page to check that cancelling brings you back to the site.

**Go live**
1. In Stripe, turn **Test mode off**. Products and links are separate in live mode, so repeat steps 2 to 5 there (redirect to `https://corterdigital.com/thank-you`).
2. Paste the **live** link (`https://buy.stripe.com/...` without `test_`) into `src/config/guide.ts`, commit and push.
3. In Stripe **Settings → Business → Customer emails**, turn on **Successful payments** so buyers get a receipt.

**Change the price:** edit the price in Stripe (create a new price and a new payment link), then update `price:` and `paymentLink:` in `src/config/guide.ts`.

**Replace the PDF with a new version**
1. Put the new PDF in `public/downloads/`. Give it a new, hard-to-guess file name (for example add a few random letters to the end).
2. Delete the old PDF from `public/downloads/`.
3. In `src/config/guide.ts`, change `file:` to the new file name. Update `pages:` if the page count changed.
4. Commit and push. (Optional: keep your master copy in `private/`; that folder is never uploaded.)

**Good to know:** the download is not locked to payment. Anyone who has the thank-you address or the PDF link can download it, and because this GitHub repo is public the PDF is visible there too. That was a deliberate choice to keep things simple. If you ever want downloads locked to paying customers only, ask Claude to "add verified downloads for the guide".

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
