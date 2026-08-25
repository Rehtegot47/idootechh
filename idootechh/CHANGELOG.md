# Changelog

All notable changes to the IdooTech website are documented in this file.

## Unreleased

### 2026-08-24

- **Disabled dark mode, light mode only** — Removed the `prefers-color-scheme: dark` media query and the unused `html.dark` override in `src/index.css` that were silently flipping the whole site to a dark palette for any visitor with a dark OS/browser preference. `color-scheme` is now pinned to `light`.
- **Unified the hero section across About, Services, Portfolio, FAQ, and Contact** — Replaced five separate, drifting hero implementations (different heights, different visual treatments, one broken) with a single shared `PageHero` component (`src/components/PageHero.jsx` + `PageHero.css`). Each page now gets the same light, gradient-backed layout with an eyebrow badge, heading, description, image card, and optional CTA buttons, styled distinctly from the Home page's own carousel hero.
- **Fixed permanently invisible hero text on Services, Portfolio, FAQ, and Contact** — The eyebrow and heading on those four pages used a `reveal-up` scroll-reveal class that never became visible because no `IntersectionObserver` was watching the hero section, so the text rendered at `opacity: 0` on every load. The new shared hero uses self-contained CSS entrance animations instead, so the content is guaranteed to appear.
- **Removed a broken background image reference** — Services, Portfolio, FAQ, and Contact heroes all pointed at `/HOME%20(2).jpg`, a file that does not exist in `public/`, so the hero background silently failed to load. The new design doesn't depend on that file.
- **Swapped out a mismatched hero image on the About page** — The About hero previously displayed `IdooTech2.png` (the company logo) captioned "IdooTech team collaborating." It now uses a real photo (`idoo2.jpg`).
- **Avoided a third-party-branded stock image in the new Portfolio hero** — `portfolio.jpg` has "Dola AI" branding baked into the image itself; the new Portfolio hero uses `home-stats.jpg` instead.
- Deleted the CSS left behind by the old per-page heroes (`.idt-hero*`, `.s-hero*`, `.s-h1*`, `.p-hero*`, `.p-h1*`, `.f-hero*`, `.f-h1*`, `.c-hero*`, `.c-h1`) from `about.css`, `services.css`, `portfolio.css`, `faq.css`, and `contact.css`, including their now-empty responsive breakpoints.

- **Rebuilt the Portfolio page with real, verified projects** — Replaced the three fictional case studies (EduManage, generic "Client Portal", TIM) with 13 actual projects pulled from the site owner's GitHub activity and cross-checked as live: AdireByIfe, QuickBooking, Silver Tongue Consult, MindForge, EaziSchool CBT, Jakapams Staff Portal, Accelerator Hive, Viva Homes, AM Africa Computer World, TIM, GuruYard, Arduino & ESP32 Communicator, and LodgePoint. Real screenshots were captured from each live site (`public/portfolio/*.jpg`) for the 9 with a public URL.
- **Redesigned the Portfolio grid** — Replaced the old single-column, feature-bullet project blocks with a responsive card grid (`.p-grid`, `auto-fit`/`minmax(300px, 1fr)`) so it scales to a much larger project count without needing fixed breakpoints per column count.
- **Added styled "poster" cards for projects without a public live URL** — GuruYard, Arduino & ESP32 Communicator, and LodgePoint (still in development) get a brand-colored gradient card with an icon and the project name lettered directly into the image area, instead of a broken image or a generic gray placeholder.
- Fixed a flex cross-axis sizing bug where the poster card's project-name text wouldn't wrap and could overflow its card on narrower viewports; fixed by giving it an explicit `width: 100%` instead of relying on `max-width` inside a `align-items: center` flex column.
- **Fixed a site-wide mobile layout bug** — `#root` is a column flex container (`src/index.css`), but its direct children (`<nav>`, each page's `<main>`) had no `min-width` override, so Chrome's default `min-width: auto` on flex items let the widest child (now the 13-item portfolio grid) force `#root` past the viewport width instead of shrinking, breaking column-wrapping on narrow screens. Added `#root > * { min-width: 0; }` to fix it for every page, not just Portfolio.
- Replaced GuruYard's and LodgePoint's poster placeholders with real screenshots supplied directly (`public/portfolio/guruyard.jpg`, `public/portfolio/lodgepoint.jpg`) — headless capture of GuruYard's live dev site never completed cleanly across five attempts, so the owner-provided images were used instead. Arduino & ESP32 Communicator remains a branded poster card (no public URL, desktop app).

### Known issues (not addressed in this pass)

- `public/idoo3.jpg` (used in the Home hero carousel and the About "Company History" section) and `public/home-team.jpg` (used in the About "Team" section) both carry visible stock-photo watermarks ("pngtree" / a photo-stock watermark) and should be replaced with licensed assets before launch.
- `public/portfolio.jpg` has "Dola AI" branding baked into the image; it's no longer referenced by any page after this change, but the file itself should be removed or replaced if it's needed again.

### 2026-08-25

- **Removed all em/en dashes site-wide** — Replaced every `—`/`–` in page copy, metadata (`<title>`, meta description), and code comments with a plain hyphen, across `index.html`, `src/index.css`, `PageHero.css`, and the FAQ, Services, and Portfolio page content.
- **Renamed `public/portfolio/` to `public/portfolio-shots/`** — The original folder name collided with the app's own `/portfolio` route: on the live VPS deploy, a real `portfolio/` directory on the doc root short-circuited the SPA `.htaccess` rewrite (which skips any path matching a real file or directory), making `/portfolio` 404 instead of loading the app. All `PortfolioPage.jsx` image paths were updated to match.
- **Added `public/.htaccess`** — A `mod_rewrite` SPA fallback (serves `index.html` for any path that isn't a real file/directory) so React Router works on a plain Apache/OpenLiteSpeed static host, replacing the redirect behavior Netlify previously provided declaratively. Committed under `public/` so it's included in every `dist/` build automatically.
- **Built and deployed the site to production (`idootech.com.ng`)** — Replaced the placeholder maintenance page with the live app via an additive `rsync` (VPS at `207.180.250.238`, doc root `/home/idootech.com.ng/public_html`, site user `idoot5882`). The original maintenance page was preserved, not deleted, as `index.html.maintenance-backup`. Full deploy/rollback/maintenance procedures documented in the new `DEPLOYMENT.md`.
- Fixed two deploy-time incidents caught during post-deploy verification (not user-reported): a stray `portfolio/` directory left on the server from before the rename above (removed after confirming it held only the already-migrated screenshots), and a doc-root permission change (`chmod 750`) that briefly took the entire live site down by blocking OpenLiteSpeed's static-file worker from traversing it — corrected immediately (`chmod 755`).
- **Implemented the contact form backend in PHP** — `ContactPage.jsx` previously posted to `/.netlify/functions/contact`, a Netlify Function with no equivalent on the VPS, so submissions failed silently on the live site. Added `public/api/contact.php` (validates input, sends mail via the server's `sendmail`, header-injection-safe) with a gitignored `api/config.php` for the recipient/from address, created once directly on the server (never committed or synced by the deploy). Verified with a live browser submission end-to-end.

### Known issues (carried forward)

- None currently open.
