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

## 5. Node.js backend (API server)

The PHP contact backend has been replaced with a Node.js/Express server.
It handles contact form submissions, product catalog, orders, and admin
operations via MySQL.

### 5.1 Server setup (one-time)

```bash
ssh root@207.180.250.238

# Install Node.js 20.x if not present
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Create backend directory
mkdir -p /home/idootech.com.ng/server
cd /home/idootech.com.ng/server

# Copy server files from local (or rsync)
rsync -avz server/ root@207.180.250.238:/home/idootech.com.ng/server/

# Install dependencies
cd /home/idootech.com.ng/server
npm install

# Create .env from template
cp .env.example .env
# Edit .env with real credentials (DB password, Gmail app password)
nano .env
```

### 5.2 MySQL database setup

```bash
ssh root@207.180.250.238

# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE idootech;
CREATE USER 'idootech'@'localhost' IDENTIFIED BY '<your-password>';
GRANT ALL PRIVILEGES ON idootech.* TO 'idootech'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Import schema
mysql -u idooptech -p idootech < /home/idootech.com.ng/server/schema.sql
```

### 5.3 Start with PM2

```bash
cd /home/idootech.com.ng/server
pm2 start app.js --name idootech-api
pm2 save
pm2 startup   # follow the printed command to enable on boot
```

### 5.4 OpenLiteSpeed reverse proxy

The API must be proxied through OpenLiteSpeed so `https://idootech.com.ng/api/*`
reaches the Node.js server on port `3001`.

In CyberPanel → Manage VHosts → Rewrite Rules, or edit the vhost config directly:

```
# Proxy /api/* to Node.js backend
rewrite  {
    enable                  1
    rules                   {
        regex               ^/api/(.*)$
        substitution        http://127.0.0.1:3001/api/$1
        flags               [OR,L]
    }
}
```

Or via OpenLiteSpeed admin console → Virtual Hosts → idootech.com.ng →
Rewrite → Add Rewrite Rule:

| Field | Value |
|-------|-------|
| Pattern | `^/api/(.*)$` |
| Substitution | `http://127.0.0.1:3001/api/$1` |
| Flags | `OR,L` |

After saving, restart OpenLiteSpeed:
```bash
systemctl restart lsws
```

### 5.5 Test

```bash
# Contact form
/usr/bin/curl -s -X POST https://idootech.com.ng/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"a@b.com","subject":"s","message":"m"}'

# Products
/usr/bin/curl -s https://idootech.com.ng/api/products
```

### 5.6 Redeploying the backend

```bash
rsync -avz server/ root@207.180.250.238:/home/idootech.com.ng/server/
ssh root@207.180.250.238 "
  cd /home/idootech.com.ng/server
  npm install --production
  pm2 restart idootech-api
"
```

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
| API 500 /api/contact not working | Check PM2 status: `pm2 status`, `pm2 logs idootech-api`. Verify `.env` has correct DB credentials and Gmail app password. |
| Node.js backend not starting | Check port 3001 is free: `lsof -i :3001`. Check Node version: `node -v` (must be 20.x). |
| OpenLiteSpeed 502 Bad Gateway | Node.js server is down — restart with `pm2 restart idootech-api`. Check rewrite rules are correct. |

---

## 7. With Claude Code

Claude has shell + SSH access and can run the whole flow: "Build and
deploy idootech" (§2, shows dry-run before applying), "Check the idootech
site is up" (curl across `/`, a client route, `/jakapams/`), "Roll back
idootech to the last commit" (§3), "Put the maintenance page back up /
bring the live site back" (§4). It will not touch `jakapams/` or other
pre-existing doc-root content, add `--delete` without asking, or skip the
build/dry-run/ownership/verify steps. The Node.js backend (§5) requires
manual SSH — ask Claude to "deploy the backend" for rsync + PM2 restart.
