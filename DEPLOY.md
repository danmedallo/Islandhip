# Deploying IslandShipping

Target: **Hostinger KVM VPS running Ubuntu 24.04** (any plain Ubuntu VPS works the
same way). Use the bare OS template, not a CyberPanel/Webmin image — those ship
their own web server and will fight the nginx config below.

## What this app needs from the server

| Requirement | Why |
|---|---|
| PHP 8.4+ with `mbstring`, `curl`, `zip`, and a PDO driver | Laravel 13's Symfony packages require 8.4 |
| Node.js 22 | Build-time only, to compile assets |
| A cron daemon **or** an external cron service | Refreshes the timetable weekly |
| HTTPS | **Service workers do not register over plain HTTP** — the PWA stays dormant without it |

That is an ordinary PHP app. `scrape:schedules` reads the source timetable
over plain HTTP, so there is no headless browser, no Node at runtime and no
`proc_open` requirement — this runs fine on shared hosting as well as a VPS.

---

## 1. Create the deploy user

Everything below runs as `deploy`.

```bash
adduser deploy && usermod -aG sudo deploy
# copy your SSH key to /home/deploy/.ssh/authorized_keys
# then disable root login and password auth in /etc/ssh/sshd_config
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

## 2. Install the stack

Laravel 13's Symfony packages require **PHP 8.4**, but Ubuntu 24.04 ships 8.3,
so add the PPA first. (`composer.json` says `^8.3`; the lock file does not agree
with it — installing on 8.3 produces a fatal error at boot.)

```bash
sudo add-apt-repository -y ppa:ondrej/php && sudo apt update

sudo apt install -y \
  nginx git unzip mysql-server \
  php8.4-fpm php8.4-cli php8.4-mysql php8.4-xml php8.4-mbstring \
  php8.4-curl php8.4-zip php8.4-bcmath php8.4-intl php8.4-sqlite3
```

Then Composer, and Node 22 from NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3. Deploy the application

```bash
cd /var/www
git clone https://github.com/danmedallo/Islandhip.git islandhip
cd islandhip

composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

Edit `.env`:

```dotenv
APP_NAME=IslandShipping
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_DATABASE=islandhip
DB_USERNAME=islandhip
DB_PASSWORD=...
```

> SQLite also works on a VPS (persistent disk). If you keep it, note that
> sessions, cache and the queue all share the one file, so heavy traffic can
> produce `database is locked`. MySQL is already installed above and avoids that.

Then:

```bash
php artisan migrate --force

npm ci          # NOT --omit=dev: vite, tailwind and vite-plugin-pwa are devDependencies
npm run build

php artisan config:cache
php artisan route:cache
php artisan view:cache

sudo chown -R deploy:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

## 4. Check the timetable refresh

```bash
php artisan scrape:schedules
# expect: ✅ Done! ~215 schedules saved.
```

This is a single HTTPS request to the source timetable API, so it takes about
a second. If it fails, the reason is logged to `storage/logs/laravel.log`.

## 5. nginx and HTTPS

Serve from `public/`, never the project root:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/islandhip/public;

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* { deny all; }

    client_max_body_size 20M;
}
```

`/sw.js` is a Laravel route, not a file, so it falls through to PHP via
`try_files` — that is intentional, and how the worker gets root scope.

```bash
sudo ln -s /etc/nginx/sites-available/islandhip /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

HTTPS is required, not optional: without it the service worker never registers
and the PWA (offline mode, install prompt) silently does nothing.

## 6. Schedule the scrape

Laravel's scheduler is not a daemon — the OS must call it. As `deploy`:

```bash
crontab -e
```

```cron
* * * * * cd /var/www/islandhip && php artisan schedule:run >> /dev/null 2>&1
```

The scrape itself is defined in `routes/console.php` and runs **Saturdays at
21:00 UTC** (05:00 Sunday Manila). Confirm with:

```bash
php artisan schedule:list
php artisan schedule:test --name="scrape:schedules"   # run it now
```

---

## Updating an existing deployment

`git pull` alone is **not** enough — `public/build` is gitignored and never in
the repo.

```bash
cd /var/www/islandhip
php artisan down

git pull
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force

php artisan config:cache && php artisan route:cache && php artisan view:cache

php artisan up
```

---

## Troubleshooting

### The refresh fails to reach the API

```
❌ Refresh failed: could not reach the schedule API - ...
```

Check outbound HTTPS is not blocked, then try the endpoint by hand:

```bash
curl -s -o /dev/null -w '%{http_code}
' \
  -H "apikey: $(php artisan tinker --execute='echo config("scraper.key");')" \
  "$(php artisan tinker --execute='echo config("scraper.endpoint");')?select=id&limit=1"
```

A 401 means the source site rotated its public API key; update
`SCHEDULE_API_KEY` in `.env`.

### The refresh reports 0 schedules

That is a **failure**, not an empty week — it means the API returned nothing, so
its shape has probably changed. The command logs an error, exits non-zero, and
deliberately **leaves the existing data untouched** rather than emptying the
table. Check the response shape against `expandToWeek()` in
`app/Console/Commands/ScrapeSchedules.php`.

### Nothing happens on Saturday

Check in this order:

```bash
crontab -l                      # is the schedule:run line there, for the right user?
php artisan schedule:list       # is the task registered?
grep scrape storage/logs/laravel.log
```

A successful run logs `scrape:schedules succeeded {"count":...}`. The absence of
that line is itself the signal that cron never fired.

### `.env` changes have no effect

`config:cache` bakes the config in. Re-run it after every `.env` edit:

```bash
php artisan config:cache
```

### The PWA won't install / offline mode does nothing

- Confirm the site is on **HTTPS** — service workers refuse to register otherwise.
- Confirm `npm run build` ran on the server; without it `/sw.js` returns 404.
- The worker is only registered in production builds, by design, so it never
  interferes with `npm run dev`.
- Updates activate on the next full app launch rather than mid-session, so a
  previously open tab may run the old assets until it is closed.
