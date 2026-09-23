import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import useOnline from '@/Hooks/useOnline';

/**
 * Content pages only, by Inertia component name.
 *
 * Left out on purpose:
 *   BookTrip      - a booking flow; nothing should compete with finishing it
 *   Install       - a short utility page, not somewhere to sell
 *   Dashboard     - someone's account
 *   Profile/Edit  - someone's account
 *
 * The auth screens use GuestLayout, which has no slot at all.
 */
const CONTENT_PAGES = ['Welcome', 'Schedule', 'OurRoute', 'Routefare'];

const DISMISSED_KEY = 'islandship:ad-dismissed';

// sessionStorage, not localStorage: closing it clears the bar for this visit
// without burning the slot permanently on that device.
const wasDismissed = () => {
    try {
        return sessionStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
        return false;
    }
};

/**
 * A sponsor bar anchored to the bottom of the viewport.
 *
 * Anchored placement is worth more than an in-flow slot because it stays in
 * view, so the things that stop it being a nuisance matter more here:
 *
 *  - Dismissible. A sticky ad you cannot close is the kind people resent.
 *  - A spacer of equal height sits in normal flow, so the bar can never hide
 *    the last row of a schedule or the pagination controls.
 *  - Short (56px), not the 90px an in-flow banner can afford.
 *  - Respects the iPhone home-indicator inset when installed to the home
 *    screen, where there is no browser chrome below it.
 */
export default function AdSlot() {
    const { props, component } = usePage();
    const ads = props.ads;
    const online = useOnline();
    const [dismissed, setDismissed] = useState(wasDismissed);

    if (!ads?.enabled || !CONTENT_PAGES.includes(component) || dismissed) {
        return null;
    }

    const { label, image, url, alt } = ads.sponsor ?? {};
    const hasSponsor = Boolean(image && url);

    // A network script cannot load without a connection and would leave an
    // empty bar pinned to the screen. A self-hosted image is cached with the
    // rest of the app, so only the network case is gated.
    if (!hasSponsor && !online) {
        return null;
    }

    const dismiss = () => {
        setDismissed(true);
        try {
            sessionStorage.setItem(DISMISSED_KEY, '1');
        } catch {
            // Storage unavailable; the bar simply returns on the next page.
        }
    };

    return (
        <>
            {/* Keeps the bar from covering the end of the page */}
            <div aria-hidden="true" className="h-[56px]" />

            <aside
                aria-label="Sponsor"
                className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <div className="max-w-6xl mx-auto h-[56px] px-3 flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0 hidden sm:block">
                        Sponsored
                    </span>

                    <div className="flex-1 min-w-0 flex items-center justify-center">
                        {hasSponsor ? (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="block max-h-[44px]"
                            >
                                <img
                                    src={image}
                                    alt={alt || label || 'Sponsor'}
                                    loading="lazy"
                                    className="max-h-[44px] w-auto rounded-lg"
                                />
                            </a>
                        ) : (
                            /*
                             * An ad network's snippet goes here. Keep it inside
                             * this box so the fixed height still applies and the
                             * bar cannot grow over the page.
                             */
                            null
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={dismiss}
                        aria-label="Hide sponsor"
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </aside>
        </>
    );
}
