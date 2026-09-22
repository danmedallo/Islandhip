# Deploying free on Render

An alternative to [DEPLOY.md](DEPLOY.md), for getting the site online **without
paying and without a credit card**. Every account here signs in with GitHub.

The trade-off: **the weekly scrape does not run automatically.** Render's free
tier has no cron. You refresh the schedules yourself, from your own machine, in
about fifteen seconds — see [Refreshing the schedules](#refreshing-the-schedules).

| | Render (free) | VPS ([DEPLOY.md](DEPLOY.md)) |
|---|---|---|
| Cost | free | ~$6/mo |
| Cold start | 30–60s after ~15 min idle | none |
| Automatic weekly scrape | ❌ manual | ✅ cron |
| Database | Postgres (Neon) | MySQL or SQLite on disk |
| Server admin | none | yours |

Both deployments run the same code. Moving from one to the other changes only
environment variables.

---

## 1. Create the database (Neon)

Render's own free Postgres expires after a short trial, so use **Neon**, whose
free tier does not.

1. Sign in at [neon.tech](https://neon.tech) with GitHub.
2. Create a project — pick the region nearest your users (Singapore for the
   Philippines).
3. Copy the connection details. You need host, database, user and password.

## 2. Create the web service (Render)

1. Sign in at [render.com](https://render.com) with GitHub.
2. **New → Web Service**, connect this repository.
3. Render detects the `Dockerfile` automatically. Set:
   - **Instance type:** Free
   - **Region:** Singapore
   - **Health check path:** `/up`

## 3. Environment variables

Set these on the Render service. Generate `APP_KEY` locally with
`php artisan key:generate --show` and paste the whole `base64:...` string.

```dotenv
APP_KEY=base64:...
APP_NAME=IslandShipping
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-service.onrender.com

DB_CONNECTION=pgsql
DB_HOST=<neon host>
DB_PORT=5432
DB_DATABASE=<neon database>
DB_USERNAME=<neon user>
DB_PASSWORD=<neon password>
DB_SSLMODE=require          # Neon refuses unencrypted connections

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

`APP_URL` must be the `https://` address — Laravel builds absolute URLs from it,
and the service worker will not register over plain HTTP.

Migrations run automatically on boot. Set `RUN_MIGRATIONS=false` to skip them.

## 4. Deploy

Push to the branch Render is watching. The build takes a few minutes: it builds
the front-end assets, installs PHP dependencies without dev packages, then
serves the app with FrankenPHP.

Once live, check:

- `https://your-service.onrender.com` loads
- `https://your-service.onrender.com/sw.js` returns JavaScript
- The browser offers to install the app (HTTPS is automatic on Render, so the
  PWA works immediately)

---

## Refreshing the schedules

The scrape needs headless Chrome, which is deliberately **not** in the container —
it would add ~300MB to an image that never runs it. Instead, run the scrape on
your own machine, pointed at the deployed database:

```bash
DB_CONNECTION=pgsql \
DB_HOST=<neon host> \
DB_PORT=5432 \
DB_DATABASE=<neon database> \
DB_USERNAME=<neon user> \
DB_PASSWORD=<neon password> \
DB_SSLMODE=require \
php artisan scrape:schedules
```

That writes straight to production. Expect `✅ Done! ~215 schedules scraped and
saved.` and the site reflects it immediately.

Do this whenever the ferry schedule changes — weekly, if you want to match what
the cron would have done. It is the exact same command the VPS cron runs.

> Keep these credentials out of your committed `.env`. Either export them in your
> shell for the one command, or keep a separate uncommitted `.env.production`
> file.

---

## Known limitations

**Cold starts.** The free instance sleeps after ~15 minutes of inactivity, and
the next visitor waits 30–60 seconds. Repeat visitors are partly shielded by the
service worker, which serves cached schedule pages instantly — but a first-time
visitor arriving to a sleeping instance will wait.

**Ephemeral disk.** Nothing written inside the container survives a restart. This
is why the database is external and `SESSION_DRIVER`/`CACHE_STORE` point at it
rather than at files. Do not switch `DB_CONNECTION` to `sqlite` here — the file
would be wiped on every deploy.

**No scheduler.** `routes/console.php` still defines the Saturday scrape, but
nothing calls `php artisan schedule:run`, so it never fires. That is expected on
this tier; the manual command above replaces it.

---

## Moving to a VPS later

When you outgrow the cold starts, follow [DEPLOY.md](DEPLOY.md). The code needs
no changes. You can either keep Neon as the database (just copy the same `DB_*`
values into the server's `.env`) or migrate to local MySQL with `pg_dump`.

Once the VPS cron is running, the manual refresh above becomes unnecessary.
