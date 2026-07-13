# Water Bearer Coffee — Website

Fast, editorial marketing site for Water Bearer Coffee (Traverse City, MI).
Built with **Astro + TypeScript + Tailwind CSS**. Static site, no database.
Payments stay on **Square** — every "Buy"/"Order" button deep-links to the
existing Square shop in a new tab.

- **Lighthouse:** 100 / 100 / 100 / 100 (performance, accessibility,
  best-practices, SEO) on mobile.
- **Forms:** Netlify Forms (no backend).

---

## ⚡ Quick start (for a developer)

```sh
npm install
npm run dev      # local dev at the printed URL
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

Requires Node 20+ (built and tested on Node 22).

---

## 🚀 Deploy to Netlify (one command)

The repo is pre-configured (`netlify.toml`). Two options:

**Option A — connect the Git repo (recommended):**
1. Push this repo to GitHub.
2. In Netlify: *Add new site → Import from Git →* pick the repo.
3. Netlify auto-detects the settings (`npm run build`, publish `dist`). Click deploy.

**Option B — deploy from your machine:**
```sh
npm install -g netlify-cli
netlify deploy --build --prod
```

**Forms:** they work automatically once deployed to Netlify — no setup.
Submissions appear in your Netlify dashboard under **Forms**
(`mobile-espresso-inquiry`, `contact`, `newsletter`, `pantry-notify`).
Turn on email notifications there: *Site settings → Forms → Form notifications*.

> Before launch, set the real domain in **`astro.config.mjs`** (`site:`) and in
> **`public/robots.txt`** so the sitemap, canonical tags, and social previews
> use the correct URL.

---

## ✏️ Editing content (no coding required)

**All text, prices, and hours live in plain files under `src/content/`.**
Edit a file, save, and the site updates on the next deploy. You don't touch any
of the design or page code.

> Anywhere you see `<!-- DRAFT COPY - NEEDS OWNER REVIEW -->`, that's placeholder
> text I wrote for you to replace. Search the project for `DRAFT` to find them all.

### Where to change common things

| I want to change…                    | Edit this file |
| ------------------------------------ | -------------- |
| Address, phone, email, **hours**, social links, Square links | `src/content/site.json` |
| A coffee (name, price, notes, story) | `src/content/coffee/<name>.md` |
| Add a new coffee                     | Copy an existing file in `src/content/coffee/` and rename it |
| The café menu + prices               | `src/content/menu/*.md` |
| Pantry items (syrups, chai, cold brew) | `src/content/pantry/<name>.md` |
| About / Mobile Espresso / Rewards copy | `src/content/pages/*.md` |

### How a content file looks

The part between the `---` lines is structured data (keep the labels, change the
values). Everything below the second `---` is free-form text.

```markdown
---
name: "Ethiopia Guji"
price: 22            # dollars, numbers only — no "$"
roastLevel: "Light"  # Light, Medium-Light, Medium, Medium-Dark, or Dark
tastingNotes: ["Blueberry", "Jasmine", "Stone fruit"]
squareUrl: "https://waterbearercoffee.square.site/product/ethiopia-guji"
---

The long story paragraph goes here.
```

If you mistype a field (e.g. put text where a number goes), the build will stop
with a clear message instead of publishing something broken — that's on purpose.

### Coming-soon pantry items

In a pantry file, set `status: "coming-soon"` and it automatically shows a
**Coming Soon** badge with an email-capture instead of a Buy button. Change it to
`status: "available"` and add a `squareUrl:` to launch it.

### Adding real photos

The site currently uses tasteful solid-color placeholder blocks (never stock
photos). When you have real photography, hand it to a developer — swapping a
placeholder for an optimized image is a small, localized change (the label on
each placeholder says what shot belongs there).

### Instagram feed

The homepage Instagram grid (`src/components/InstagramGrid.astro`) currently reads
**placeholder posts** from `src/data/instagram.json`. To show the **live** feed, we
need a data source — and that's a decision for Azure, not something to guess at:

- **A feed service** (e.g. Behold, EmbedSocial, LightWidget) — easiest; they handle
  Instagram's auth and give a simple JSON/embed. Usually a small monthly fee.
- **The Meta Graph API directly** — no monthly fee, but requires a Facebook/Instagram
  Business account, an app, and a long-lived access token that must be refreshed.

Once a source is chosen, a developer swaps the local-file import in `InstagramGrid.astro`
for that source (the `{ handle, profileUrl, posts[] }` shape stays the same, so the
grid markup doesn't change).

### Rewards signup

The loyalty vendor isn't chosen yet. When it is, a developer sets **one line** in
`src/components/RewardsSignupSlot.astro` (a link or an embed) and the sign-up
button goes live. No custom punch-card system is built into the site — that
requires the Square POS, not the website.

---

## 📁 Project structure

```
src/
├─ content/            ← ALL editable content (see table above)
│  ├─ site.json        ← global business info + hours
│  ├─ coffee/          ← one file per roast
│  ├─ menu/            ← one file per menu category
│  ├─ pantry/          ← retail line (syrups, chai, cold brew)
│  └─ pages/           ← About, Mobile Espresso, Rewards copy
├─ pages/              ← the page routes (design/code — leave to a developer)
├─ components/         ← reusable building blocks
├─ layouts/            ← the shared page shell (nav, footer, <head>)
└─ styles/
   ├─ tokens.css       ← colors, fonts, spacing — change brand colors here
   └─ global.css       ← base styles
```

### Design tokens

Brand colors and the type scale live in **`src/styles/tokens.css`**. Changing the
HEX values there re-skins the whole site consistently. Current palette is
"Bone & Clay" (warm bone background, near-black text, clay accent) with Fraunces
(headings) + Inter (body).

---

## ✅ Still needed from the owner before launch

These are placeholders right now — search for `DRAFT` / `NEEDS OWNER REVIEW`:

- Real **address, phone, hours** → `src/content/site.json`
- Real **Square product URLs** for each coffee and pantry item
- Actual **coffee lineup** (names, origins, tasting notes, prices)
- The **roaster's name and story** (About page)
- **Brand colors, fonts, logo** (if different from the current direction)
- **Photography** (placeholders used until then)
- The real **production domain** (in `astro.config.mjs` + `robots.txt`)
- **Rewards vendor** link/embed (in `RewardsSignupSlot.astro`)
