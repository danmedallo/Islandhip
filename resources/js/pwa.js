// The worker is built to public/build/sw.js but served from the site root by
// the /sw.js route, so that its scope covers every page rather than /build.
const SW_URL = '/sw.js';
const LAST_USER_KEY = 'islandship:last-user';

export function registerServiceWorker() {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register(SW_URL, { scope: '/' }).catch((error) => {
            console.error('Service worker registration failed:', error);
        });
    });
}

// Public pages are cached for offline reading, and they render the signed-in
// user's name in the navbar. Drop them whenever the account changes so a stale
// copy can't show the previous user after a logout.
export function forgetCachedPagesOnAuthChange(user) {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    const current = user?.id == null ? '' : String(user.id);
    let previous = '';

    try {
        previous = localStorage.getItem(LAST_USER_KEY) ?? '';
    } catch {
        // Storage is unavailable (private mode, blocked cookies); skip the check.
        return;
    }

    if (previous === current) {
        return;
    }

    try {
        localStorage.setItem(LAST_USER_KEY, current);
    } catch {
        return;
    }

    navigator.serviceWorker.controller?.postMessage({ type: 'CLEAR_PAGE_CACHE' });
}
