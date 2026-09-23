import { Link } from '@inertiajs/react';
import { useState } from 'react';
import useInstall from '@/Hooks/useInstall';

const DISMISSED_KEY = 'islandship:install-dismissed';

const wasDismissed = () => {
    try {
        return localStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
        return false;
    }
};

export default function InstallBanner() {
    const { mode, install } = useInstall();
    const [dismissed, setDismissed] = useState(wasDismissed);

    // Only worth showing where there is something actionable to offer.
    if (dismissed || !['prompt', 'ios'].includes(mode)) {
        return null;
    }

    const dismiss = () => {
        setDismissed(true);
        try {
            localStorage.setItem(DISMISSED_KEY, '1');
        } catch {
            // Storage unavailable; the banner simply returns next visit.
        }
    };

    return (
        <div className="bg-green-700 text-white">
            <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">⚓</span>

                <p className="flex-1 text-sm">
                    Install IslandShipping for offline schedules.
                </p>

                {mode === 'prompt' ? (
                    <button
                        type="button"
                        onClick={() => install()}
                        className="shrink-0 px-3 py-1.5 bg-white text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors"
                    >
                        Install
                    </button>
                ) : (
                    <Link
                        href="/install"
                        className="shrink-0 px-3 py-1.5 bg-white text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors"
                    >
                        How
                    </Link>
                )}

                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss"
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-800 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
