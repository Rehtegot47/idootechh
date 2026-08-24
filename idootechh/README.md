# IdooTech — Innovating Every Day

Vite + React 19 + React Router 7 marketing site for IdooTech (https://www.idootech.com.ng). Builds to Netlify with serverless contact form (Supabase + Gmail SMTP).

## Stack
- Vite 8, React 19, react-helmet-async (SEO), Swiper (hero), vite-plugin-image-optimizer
- Netlify Functions (`netlify/functions/contact.js`, `messages.js`), `@supabase/supabase-js`, `nodemailer`

## Routes
`/` Home, `/about`, `/services`, `/portfolio`, `/faq`, `/contact`, `*` 404 — lazy-loaded via `src/App.jsx:8`

## Local dev
```bash
npm install              # in idootechh/
npm run dev              # http://localhost:5173
npm run lint
npm run build && npm run preview
```
From repo root: `npm run dev` / `npm run build` proxy via `../package.json`.

## Environment
Copy `idootechh/.env.example` to `.env` (gitignored) and fill:
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SMTP_USER=        # Gmail address (2-step + App Password)
SMTP_PASS=        # Gmail App Password
CONTACT_RECIPIENT=info@idootech.com.ng
ADMIN_TOKEN=      # random secret for GET /.netlify/functions/messages
```
Set same vars in Netlify → Site settings → Environment variables.

## Supabase setup
Create table `messages`:
```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);
-- RLS off for service_role; or enable RLS and allow service_role insert/select
```
Retrieve messages: `GET /.netlify/functions/messages` with header `x-admin-token: $ADMIN_TOKEN` (`?limit=50` max 100).

## Deploy (Netlify)
- **Build base:** `idootechh` (`netlify.toml` at repo root sets `base = "idootechh"`)
- **Build command:** `npm run build`
- **Publish:** `dist`
- **Functions:** `netlify/functions`
- SPA redirect `/* -> /index.html 200` via `netlify.toml` + `public/_redirects`
- Ensure env vars are set; otherwise contact form returns 200 with `warnings` and skips DB/email.

## What was fixed 2026-08-24
- Lint: `App.jsx` menu close via `queueMicrotask`, `CookieConsent` lazy init, `HomePage` Swiper `onBeforeInit` only, `Portfolio` unused var
- Assets: `services (1).jpg` → `services.jpg`, `HOME (2).jpg` → `home-hero.jpg`, `HOME1.jpg` → `home-stats.jpg`, `HOME (3).jpg` → `home-team.jpg`
- About hero links `#services/#contact` → React Router `<Link to="/services|/contact">`
- SEO: `index.html` title/meta/canonical/og:image, `SEO.jsx` canonical + og:image/twitter:image, `robots.txt` + `sitemap.xml`
- Netlify: root `netlify.toml` with `base = "idootechh"` for correct deploy from repo root

## Manual steps before first deploy
1. Create Supabase project + run SQL above
2. Create Gmail App Password, set env vars locally and in Netlify
3. `npm run lint && npm run build` (both pass)
4. Review commit locally, then `git push origin main`
5. Test `/contact` submission and `/.netlify/functions/messages` with admin token
