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

## ☕ How to edit your website

This is for **Azure**. You can update your own site from any web browser — no coding,
nothing to install. You can edit the **Menu**, **Summer Specials**, **Hours**, the
**About page**, and the **homepage hero photo**. Everything else (the design, colors,
and layout) is locked so it can't accidentally break.

**Changes go live about a minute after you click Publish.**

### Logging in

1. Go to **yourwebsite.com/admin** (bookmark it).
2. Click **Login** and enter your email and password.
   - First time? Check your email for an invite and click the link to set your password.
3. You'll see the editor with a list on the left: **Menu, Summer Specials, Hours,
   About Page, Homepage**.

Every time you make a change, click the **Publish** button (top of the screen) to save it.
Your site updates on its own about a minute later.

### Add a menu item

1. Click **Menu** → **New Menu item**.
2. Fill in the **Item name**, pick a **Section** (Coffee, Teas, Smoothies, or Food),
   and write a short **Description**.
3. Optionally add a **Photo** (any size is fine — it's shrunk automatically).
4. Click **Publish**. It appears on the menu in its section.

### Remove or hide a seasonal item

- To **hide** an item for the season without losing it: open it, turn on
  **"Hide this item (seasonal)"**, and Publish. It disappears from the menu but stays
  saved. Turn the switch back off later to bring it back.
- To **delete** it for good: open the item and choose **Delete** (bottom of the page).

### Reorder menu items

Each item has an **Order** number. Lower numbers show first within a section. Change the
numbers (10, 20, 30…) and Publish to reorder.

### Post a special

1. Click **Summer Specials** → **New Special**.
2. Add a **Name**, **Description**, optional **Photo**, and an **End date**.
3. Publish. It shows in the "Summer Specials" strip on the homepage and **disappears on
   its own after the end date** — no need to come back and delete it.

### Change your hours

1. Click **Hours**.
2. For each day, set **Opens** and **Closes** (24-hour time, like `08:00` and `15:00`),
   or turn on **Closed?** for a day you're shut.
3. There's also a **Kitchen note** line (e.g. "Kitchen closes daily at 2 PM").
4. Publish.

### Swap the homepage hero photo

1. Click **Homepage** → **Homepage Hero**.
2. Click the **Hero photo**, upload a new one, and update the **Photo description**.
3. Publish.

### A few tips

- **Photos:** upload straight from your phone — big photos are automatically resized so
  your site stays fast. Always fill in the "Photo description" (it helps accessibility
  and Google).
- **Prices** have a spot in each menu item, but they are **not shown on the site** right
  now (ordering and prices live on Square). You can still record them there.
- If something looks wrong, you can't break the design — just fix the text and Publish
  again, or ask your developer.

---

## 🔑 Inviting Azure (developer — one-time)

Auth is **Netlify Identity + Git Gateway**, so Azure logs in with email + password and
never needs a GitHub account.

1. In Netlify → **Site configuration → Identity**: click **Enable Identity**.
2. Under **Identity → Registration**, set it to **Invite only**.
3. Under **Identity → Services → Git Gateway**: click **Enable Git Gateway**.
4. Under **Identity → Emails**, you can customize the invite/confirmation emails (optional).
5. Go to the **Identity** tab → **Invite users** → enter Azure's email.
   She gets an email, clicks the link, sets a password, and lands in `/admin`.

That's the whole handoff. (Transferring the GitHub repo / Netlify site / domain to her own
accounts, if you ever do, is separate and manual — the site itself is identical either way.)

### Developer notes

- **Content lives in `src/content/`** — `menu/` (one file per item), `specials/`,
  `settings/hours.json`, `settings/about.json`, `settings/home.json`. Plain and portable.
- **Image optimization** runs two ways: Sveltia resizes/*WebP*s on upload, and
  `scripts/optimize-images.mjs` runs on every build (`npm run build`) as a backstop so no
  oversized image can ship. Idempotent — already-small images are skipped.
- **Instagram** grid reads placeholder posts from `src/data/instagram.json`. To go live it
  needs a feed source (a Behold/EmbedSocial-style service, or a Meta Graph API token) — a
  decision for the owner, not a guess. Keep the `{ handle, profileUrl, posts[] }` shape and
  the grid markup doesn't change.

---

## 🛒 Wiring up Square buy buttons (Shop page)

The **Shop page** (`/shop`) sells physical products — bags of coffee, gift cards,
and so on. We do **not** run a checkout on this site: each product's "Buy" button
is a snippet **you** generate in Square, and clicking it takes the customer to
**Square's own secure checkout page** (with Apple Pay, Google Pay, Cash App, and
Afterpay built in). Nothing to install, no keys to manage.

Until you add a snippet, a product shows a clearly-marked **"Buy on Square — link
pending"** placeholder, so it's obvious which items aren't wired up yet.

### Steps to add a buy button

1. In your **Square Dashboard**, go to **Payment Links** (under *Online* / *Item
   Library → Payment Links*).
2. **Create a payment link** → *Add a website button*, choose the item (or make a
   new one) and set the **price**.
3. Square shows a small block of **HTML** — click **Copy code**.
4. Paste that HTML into the product's `squareEmbed` field:
   - In a file: `src/content/products/<product>.md`, between the `---` lines, e.g.
     `squareEmbed: "<paste here>"`, and set `status: "available"`.
   - Or just **hand me the copied code** and tell me which product — I'll paste it.
5. Save/deploy. The button appears on the Shop page and opens Square's checkout.

For a product that isn't for sale yet, set `status: "coming-soon"` — it shows a
**Coming soon** badge and a "notify me" email box instead of a buy button.

### Good to know

- **Branding:** set your **logo and button color** on the checkout page under
  Square → *Account & Settings → Branding* (or the payment link's appearance
  settings). That styling lives on Square's side, not ours.
- **Fees:** Square charges **3.3% + 30¢ per online transaction**, with **no
  monthly fee** for Payment Links.
- **Get notified of sales:** when creating each link, turn on its **email
  notification** so you get an email every time something sells online.
- The food/drink **"Order Online"** button is separate — it stays a link to your
  Square Online ordering page and has nothing to do with these buy buttons.

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
