import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import useOnline from '@/Hooks/useOnline';

function Tile({ href, icon, title, description, disabled, disabledNote }) {
    if (disabled) {
        return (
            <span
                className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 opacity-60 cursor-not-allowed"
                title={disabledNote}
            >
                <span className="text-xl shrink-0" aria-hidden="true">{icon}</span>
                <span>
                    <span className="block text-sm font-semibold text-gray-900">{title}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{disabledNote}</span>
                </span>
            </span>
        );
    }

    return (
        <Link
            href={href}
            className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
        >
            <span className="text-xl shrink-0" aria-hidden="true">{icon}</span>
            <span>
                <span className="block text-sm font-semibold text-gray-900">{title}</span>
                <span className="block text-xs text-gray-500 mt-0.5">{description}</span>
            </span>
        </Link>
    );
}

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const online = useOnline();
    const firstName = user.name.split(' ')[0];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-green-700 rounded-xl flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold text-gray-900"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            Welcome back, {firstName}
                        </h1>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    <Tile
                        href="/schedule"
                        icon="📅"
                        title="Ferry schedules"
                        description="Browse and filter every trip"
                    />
                    <Tile
                        href="/book"
                        icon="🎫"
                        title="Book a trip"
                        description="Reserve your next sailing"
                        disabled={!online}
                        disabledNote="Needs a connection"
                    />
                    <Tile
                        href="/routefare"
                        icon="💰"
                        title="Routes & fares"
                        description="Work out what a trip costs"
                    />
                    <Tile
                        href={route('profile.edit')}
                        icon="👤"
                        title="Your profile"
                        description="Name, email and password"
                    />
                </div>

                <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                        💡 Add IslandShipping to your home screen to check
                        schedules offline —{' '}
                        <Link
                            href="/install"
                            className="font-medium text-green-700 hover:text-green-800"
                        >
                            see how
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
