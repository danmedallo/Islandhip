import AppLayout from '@/Layouts/AppLayout';
import useInstall from '@/Hooks/useInstall';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

function Step({ n, children }) {
    return (
        <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center">
                {n}
            </span>
            <span className="text-sm text-gray-600 leading-6">{children}</span>
        </li>
    );
}

export default function Install() {
    const { mode, install } = useInstall();
    const [outcome, setOutcome] = useState(null);

    const onInstall = async () => setOutcome(await install());

    return (
        <AppLayout>
            <Head title="Install the app" />

            <div className="max-w-xl mx-auto px-4 py-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-700 rounded-2xl flex items-center justify-center text-white text-3xl">
                        ⚓
                    </div>
                    <h1
                        className="text-2xl font-bold text-gray-900"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        Install IslandShipping
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Add it to your home screen for faster access and offline
                        schedules.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    {mode === 'installed' && (
                        <p className="text-sm text-gray-600">
                            ✅ You're already running the installed app. Nothing
                            to do.
                        </p>
                    )}

                    {mode === 'prompt' && (
                        <>
                            <button
                                type="button"
                                onClick={onInstall}
                                className="w-full px-4 py-3 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
                            >
                                Install app
                            </button>

                            {outcome === 'dismissed' && (
                                <p className="mt-3 text-sm text-gray-500 text-center">
                                    No problem — you can install any time from
                                    this page.
                                </p>
                            )}
                            {outcome === 'accepted' && (
                                <p className="mt-3 text-sm text-green-700 text-center">
                                    Installing… check your home screen.
                                </p>
                            )}
                        </>
                    )}

                    {mode === 'ios' && (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                On iPhone and iPad, Safari adds apps to the home
                                screen manually:
                            </p>
                            <ol className="space-y-3">
                                <Step n="1">
                                    Tap the <strong>Share</strong> button at the
                                    bottom of Safari (the square with an arrow
                                    pointing up).
                                </Step>
                                <Step n="2">
                                    Scroll down and tap{' '}
                                    <strong>Add to Home Screen</strong>.
                                </Step>
                                <Step n="3">
                                    Tap <strong>Add</strong>. The anchor icon
                                    appears on your home screen.
                                </Step>
                            </ol>
                        </>
                    )}

                    {mode === 'ios-other' && (
                        <p className="text-sm text-gray-600">
                            On iPhone and iPad only <strong>Safari</strong> can
                            add apps to the home screen. Open this page in
                            Safari, then come back here.
                        </p>
                    )}

                    {mode === 'manual' && (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                Your browser handles installing from its own
                                menu:
                            </p>
                            <ol className="space-y-3">
                                <Step n="1">
                                    Open the browser menu (⋮ or ⋯).
                                </Step>
                                <Step n="2">
                                    Choose <strong>Install app</strong> or{' '}
                                    <strong>Add to Home screen</strong>.
                                </Step>
                            </ol>
                            <p className="mt-4 text-xs text-gray-400">
                                If you don't see the option, your browser may
                                not support installing web apps. Chrome, Edge
                                and Safari all do.
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">
                        What you get
                    </h2>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>📅 Schedules you've opened stay readable offline</li>
                        <li>⚡ Opens instantly, no browser chrome</li>
                        <li>🏠 Its own icon on your home screen</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
