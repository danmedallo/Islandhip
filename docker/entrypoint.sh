#!/bin/sh
set -e

# Render (and most PaaS) inject the port to bind. FrankenPHP takes it through
# SERVER_NAME; the leading colon means "all interfaces".
export SERVER_NAME=":${PORT:-8080}"

# Caches are built at boot, not at image build time, because the environment
# variables they bake in only exist at runtime.
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force --no-interaction
fi

exec frankenphp run --config /etc/caddy/Caddyfile
