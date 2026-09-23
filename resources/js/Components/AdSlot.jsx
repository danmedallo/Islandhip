import { usePage } from '@inertiajs/react';
import useOnline from '@/Hooks/useOnline';

/**
 * A single sponsor slot at the foot of the page.
 *
 * Constraints it is built around:
 *
 *  - Reserved height, so nothing below it jumps when the banner loads. Layout
 *    shift is the thing that actually annoys people, more than the ad itself.
 *  - Never sticky, never an overlay, never above the content.
 *  - Labelled, so it is not mistaken for part of the schedule.
 *  - Nothing renders at all when there is no sponsor configured — an empty
 *    bordered box advertising nothing is worse than no box.
 */
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

export default function AdSlot() {
    const { props, component } = usePage();
    const ads = props.ads;
    const online = useOnline();

    if (!ads?.enabled || !CONTENT_PAGES.includes(component)) {
        return null;
    }

    const { label, image, url, alt } = ads.sponsor ?? {};

    // A network script (AdSense and friends) cannot load without a connection,
    // so it would leave a hole. A self-hosted sponsor image is cached with the
    // rest of the app and still renders, so only the network case is gated.
    const hasSponsor = Boolean(image && url);

    if (!hasSponsor && !online) {
        return null;
    }

    return (
        <aside className="border-t border-gray-200 bg-white" aria-label="Sponsor">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    Sponsored
                </p>

                {/* min-height reserves the space before anything paints */}
                <div className="min-h-[90px] flex items-center justify-center">
                    {hasSponsor ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="block w-full max-w-[728px]"
                        >
                            <img
                                src={image}
                                alt={alt || label || 'Sponsor'}
                                loading="lazy"
                                className="w-full h-auto rounded-xl border border-gray-200"
                            />
                        </a>
                    ) : (
                        /*
                         * Drop an ad network's snippet here when you have a
                         * domain it will approve. Keep it inside this box so
                         * the reserved height and the label still apply.
                         */
                        null
                    )}
                </div>

                {label && (
                    <p className="mt-2 text-center text-xs text-gray-400">{label}</p>
                )}
            </div>
        </aside>
    );
}
