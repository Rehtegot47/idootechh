# Deployment Guide — idootech.com.ng

Vite + React SPA. Unlike a flat static site, this has a **build step** —
the repo itself is never deployed, only the compiled `dist/` output. The
doc root is also a **shared, pre-existing directory** that held a
maintenance page before this site went live, and still hosts other real
content that must never be touched.

**Deploys are additive, not mirrored.** No `--delete` — rsync only adds/
updates files, never removes anything from the server.

---

## 1. Architecture

| Thing | Value |
|-------|-------|
| Server (SSH) | `ssh root@207.180.250.238` (host `panel.inett.site`) — shared box, also runs dockworkersnigeria.org.ng, adirebyife.com (pm2/Node) |
| Web server | CyberPanel / **OpenLiteSpeed** — serves files from disk, no proxy; PHP via `lsapi:idoot5882` (`lsphp82`) is already configured for this vhost |
| Site system user | `idoot5882:idoot5882` |
| Doc root | `/home/idootech.com.ng/public_html` |
| App routes (client-side) | `/`, `/about`, `/services`, `/portfolio`, `/tim-program`, `/faq`, `/contact` — a `public/` folder must never share a name with one of these (breaks the SPA rewrite, see §2) |

> **Do not touch:** `index.html.maintenance-backup` (original maintenance
> page, see §4), `jakapams/` (a live client portal, has its own PHP
> backend), `hansi-web-project/`, `fonts/`, stray zips, `netlify/`,
> `__MACOSX/`, `.well-known/`. The additive rsync below won't remove any
> of these — never run a `--delete`/mirrored sync against this doc root.

---

## 2. Deploy

```bash
cd "idootechh"
git add <files> && git commit -m "..." && git push origin main

npm run build   # produces dist/, includes public/.htaccess and public/api/*.php

rsync -avzn dist/ root@207.180.250.238:/home/idootech.com.ng/public_html/   # dry run first
rsync -avz  dist/ root@207.180.250.238:/home/idootech.com.ng/public_html/   # then apply

ssh root@207.180.250.238 "
  cd /home/idootech.com.ng/public_html
  chown -R idoot5882:idoot5882 .
  find . -type d -exec chmod 755 {} +
  find . -type f -exec chmod 644 {} +
"

/usr/bin/curl -s -o /dev/null -w '%{http_code}\n' https://idootech.com.ng/            # expect 200
/usr/bin/curl -s -o /dev/null -w '%{http_code}\n' https://idootech.com.ng/portfolio   # expect 200 (SPA rewrite)
/usr/bin/curl -s -o /dev/null -w '%{http_code}\n' https://idootech.com.ng/jakapams/   # expect unchanged
```

**Never `chmod` the doc root itself** — it must stay `755`. Setting it to
`750` blocks OpenLiteSpeed's worker (a different user) from traversing
into it, taking the whole site down instantly. The `chmod` above only
touches files *inside* the doc root, which is correct.

**SPA rewrite:** `public/.htaccess` (committed, auto-included in every
build) serves `index.html` for any path that isn't a real file/directory,
so React Router works without Netlify's redirect config. Its `!-d`
condition means a real directory short-circuits the rewrite — this is why
portfolio screenshots live in `public/portfolio-shots/`, not
`public/portfolio/` (that name collided with the `/portfolio` route).

---

## 3. Rollback

```bash
git log --oneline -10
git checkout <commit-hash> -- .   # or git revert
npm run build
```
Then redeploy (§2). Additive deploys don't remove files added after your
target — delete those by hand over SSH if a rollback needs them gone.

Snapshot before a risky deploy:
```bash
ssh root@207.180.250.238 "cd /home/idootech.com.ng && tar czf backup-\$(date +%Y%m%d-%H%M%S).tar.gz public_html"
```

---

## 4. Maintenance page

Backed up (not deleted) before the first real deploy:
```bash
ssh root@207.180.250.238 "cp /home/idootech.com.ng/public_html/index.html /home/idootech.com.ng/public_html/index.html.maintenance-backup"
```
**Put it back up:** `cp index.html.maintenance-backup index.html` on the
server. **Bring the live site back:** redeploy (§2) — it overwrites
`index.html` with the built app again; the backup is never touched by rsync.

---

## 5. Contact form backend (PHP)

`ContactPage.jsx` posts to `/api/contact.php` (`public/api/contact.php`,
included in every build). It validates input, sends mail via PHP's
`mail()` (server's `sendmail` is already configured), and reads the
recipient/from address from `public_html/api/config.php` — **gitignored,
created once directly on the server**, never deployed by rsync:

```bash
ssh root@207.180.250.238 "cat > /home/idootech.com.ng/public_html/api/config.php" << 'PHPEOF'
<?php
return [
    'recipient' => 'oluwadamilareidowujoshua@gmail.com',
    'from_address' => 'no-reply@idootech.com.ng',
];
PHPEOF
```
Template: `public/api/config.example.php`. Test after any redeploy:
```bash
/usr/bin/curl -s -X POST https://idootech.com.ng/api/contact.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"a@b.com","subject":"s","message":"m"}'   # expect {"ok":true}
```
`netlify/functions/contact.js` (Supabase + Nodemailer) is unused on this
deploy — kept only in case a future Netlify deploy needs it back.

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Site not returning 200 | `ssh root@207.180.250.238 "systemctl status lsws"` — shared across all sites on the box. |
| Whole site 404/403 after a deploy | Doc root permissions tightened below `755` — `chmod 755 /home/idootech.com.ng/public_html`. |
| A route (e.g. `/portfolio`) 404s but `/` works | A real file/directory on the doc root shares that route's name — rename it under `public/` and redeploy. |
| Change deployed but not visible | Client-side cache — hard refresh, or `curl` to bypass it. |
| Files wrong owner after sync | Re-run §2's `chown -R idoot5882:idoot5882`. |
| A locally-removed file is still live | Expected (no `--delete`) — remove it by hand over SSH. |
| Contact form 500/not sending | Check `api/config.php` exists on the server and `php -l` passes on `api/contact.php`. |

---

## 7. With Claude Code

Claude has shell + SSH access and can run the whole flow: "Build and
deploy idootech" (§2, shows dry-run before applying), "Check the idootech
site is up" (curl across `/`, a client route, `/jakapams/`), "Roll back
idootech to the last commit" (§3), "Put the maintenance page back up /
bring the live site back" (§4). It will not touch `jakapams/` or other
pre-existing doc-root content, add `--delete` without asking, or skip the
build/dry-run/ownership/verify steps.
