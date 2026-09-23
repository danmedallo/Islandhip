import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';

const VERSION = 'v2';
const OFFLINE_URL = '/offline.html';
const OFFLINE_CACHE = `islandship-offline-${VERSION}`;
const PAGE_CACHE = `islandship-pages-${VERSION}`;
const INERTIA_CACHE = `islandship-inertia-${VERSION}`;
const FONT_CACHE = `islandship-fonts-${VERSION}`;

// Hashed Vite output, injected at build time by vite-plugin-pwa.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// offline.html lives in public/, which Laravel serves directly and Vite never
// touches, so it is cached here rather than precached with the build output.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(OFFLINE_CACHE)
            .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: 'reload' }))),
    );
});

self.addEventListener('activate', (event) => {
    const keep = new Set([OFFLINE_CACHE, PAGE_CACHE, INERTIA_CACHE, FONT_CACHE]);

    event.waitUntil(
        caches
            .keys()
            .then((names) =>
                Promise.all(
                    names
                        .filter((name) => name.startsWith('islandship-') && !keep.has(name))
                        .map((name) => caches.delete(name)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    // Cached pages carry the signed-in user's name in the navbar, so the app
    // asks for them to be dropped whenever the account changes.
    if (event.data?.type === 'CLEAR_PAGE_CACHE') {
        event.waitUntil(Promise.all([caches.delete(PAGE_CACHE), caches.delete(INERTIA_CACHE)]));
    }
});

// Pages that render without a session and carry no live state, so they are
// safe to keep for offline reading. Anything not listed here stays online-only.
//
// /book is deliberately absent. Serving a cached booking form offline would let
// someone fill it in and believe a seat was reserved, so booking always
// requires a connection. The version bump above purges it from installs that
// cached it under v1.
const PUBLIC_PAGES = [
    /^\/$/,
    /^\/schedule$/,
    /^\/scheduleDetails\/[^/]+$/,
    /^\/route$/,
    /^\/routefare$/,
    /^\/install$/,
];

const isPublicPage = (url) =>
    url.origin === self.location.origin && PUBLIC_PAGES.some((page) => page.test(url.pathname));

const freshestFirst = (cacheName) =>
    new NetworkFirst({
        cacheName,
        networkTimeoutSeconds: 5,
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 7 }),
        ],
    });

// Full page loads.
registerRoute(
    ({ request, url }) => request.mode === 'navigate' && isPublicPage(url),
    freshestFirst(PAGE_CACHE),
);

// Inertia answers the same URLs with JSON, so those responses need a cache of
// their own or they would be served in place of the HTML above. Partial
// reloads carry only a subset of the props and must never be stored.
registerRoute(
    ({ request, url }) =>
        request.headers.has('X-Inertia') &&
        !request.headers.has('X-Inertia-Partial-Data') &&
        isPublicPage(url),
    freshestFirst(INERTIA_CACHE),
);

registerRoute(
    ({ request, url }) => url.origin === 'https://fonts.bunny.net' && request.destination === 'style',
    new StaleWhileRevalidate({ cacheName: FONT_CACHE }),
);

registerRoute(
    ({ request, url }) => url.origin === 'https://fonts.bunny.net' && request.destination === 'font',
    new CacheFirst({
        cacheName: FONT_CACHE,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }),
        ],
    }),
);

// Dashboard, profile and the auth screens stay online-only, but routing them
// through Workbox lets the catch handler below answer with the offline page
// instead of the browser's error screen.
registerRoute(new NavigationRoute(new NetworkOnly()));

setCatchHandler(async ({ request }) => {
    if (request.mode === 'navigate') {
        const offline = await caches.match(OFFLINE_URL, { cacheName: OFFLINE_CACHE });

        if (offline) {
            return offline;
        }
    }

    return Response.error();
});
