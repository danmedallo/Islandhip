# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1: build the front-end assets.
#
# --ignore-scripts skips Puppeteer's ~300MB Chrome download. The scrape does
# not run in this container (no cron here); it is triggered manually or from a
# VPS, so the browser is dead weight in the image.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json ./

# npm install, not npm ci: the lockfile is generated on macOS and omits the
# hoisted peer deps that @rolldown/binding-wasm32-wasi needs on Linux, which
# makes `npm ci` fail. Versions still come from the lockfile where they match.
RUN npm install --no-audit --no-fund --ignore-scripts

# vite.config.js reads resources/ and public/ is the build target.
COPY vite.config.js tailwind.config.js postcss.config.js ./
COPY resources ./resources
COPY public ./public

RUN npm run build


# ---------------------------------------------------------------------------
# Stage 2: PHP dependencies, without dev packages.
# ---------------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

# --no-scripts: artisan cannot run before the app code is copied in.
RUN composer install \
      --no-dev \
      --no-scripts \
      --no-autoloader \
      --prefer-dist \
      --no-interaction

COPY . .

RUN composer dump-autoload --no-dev --optimize


# ---------------------------------------------------------------------------
# Stage 3: runtime.
#
# FrankenPHP serves Laravel from a single process, so the image needs no nginx,
# php-fpm or supervisor.
# ---------------------------------------------------------------------------
FROM dunglas/frankenphp:1-php8.4-alpine

# pdo_pgsql for Postgres; dom/xml are required by the scraper's DOMXPath usage
# even though the scrape is not run here, because artisan boots the app.
RUN install-php-extensions \
      pdo_pgsql \
      pdo_mysql \
      pdo_sqlite \
      intl \
      zip \
      opcache \
      pcntl

WORKDIR /app

COPY --from=vendor /app /app
COPY --from=assets /app/public/build /app/public/build

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint \
 && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# Production PHP defaults (the base image ships the development php.ini).
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# The binary ships with cap_net_bind_service so it can bind :80. Render (and
# other platforms) run containers with no-new-privileges, which refuses to exec
# a file carrying capabilities — "Operation not permitted", exit 126. The port
# is assigned by $PORT and is never privileged, so drop the capability.
RUN setcap -r /usr/local/bin/frankenphp

ENTRYPOINT ["entrypoint"]
