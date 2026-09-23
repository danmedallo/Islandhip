import { Link } from '@inertiajs/react';

export default function GuestLayout({ title, description, children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">

            {/* Same mark and wordmark as the main navbar */}
            <a href="/" className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-green-700 rounded-xl flex items-center justify-center text-white text-xl">
                    ⚓
                </div>
                <span className="font-bold text-gray-900 text-lg">IslandShipping</span>
            </a>

            <div className="w-full sm:max-w-md bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-7 sm:px-8">
                {title && (
                    <div className="mb-6">
                        <h1
                            className="text-2xl font-bold text-gray-900"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                )}

                {children}
            </div>

            <Link
                href="/"
                className="mt-6 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
                ← Back to schedules
            </Link>
        </div>
    );
}
