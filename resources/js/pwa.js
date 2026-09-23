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

// ---------------------------------------------------------------------------
// Install prompt
//
// Chrome fires beforeinstallprompt once, early — often before React has
// mounted — so the event is captured here at module load and held for whatever
// renders later. Calling preventDefault() suppresses the browser's own banner
// so the app can offer installation in its own words.
// ---------------------------------------------------------------------------

let deferredPrompt = null;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(deferredPrompt !== null));

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        notify();
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        notify();
    });
}

export function canInstall() {
    return deferredPrompt !== null;
}

export function onInstallAvailabilityChange(listener) {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

/**
 * Show the browser's install dialog. Returns 'accepted', 'dismissed', or
 * 'unavailable' when there is no captured prompt to replay.
 */
export async function promptInstall() {
    if (!deferredPrompt) {
        return 'unavailable';
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    // The event can only be used once.
    deferredPrompt = null;
    notify();

    return outcome;
}

/** Already running from the home screen? */
export function isInstalled() {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    );
}

/**
 * iOS has no install API at all — Add to Home Screen is manual, and only
 * Safari offers it. Chrome and Firefox on iOS cannot install a PWA.
 */
export function iosInstallState() {
    if (typeof navigator === 'undefined') {
        return { isIOS: false, isSafari: false };
    }

    const ua = navigator.userAgent;
    const isIOS =
        /iPad|iPhone|iPod/.test(ua) ||
        // iPadOS reports itself as a Mac, so fall back to touch support.
        (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

    const isSafari = isIOS && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

    return { isIOS, isSafari };
}
