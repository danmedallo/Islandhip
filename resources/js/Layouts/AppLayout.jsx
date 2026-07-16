import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center text-white text-lg">
                            ⚓
                        </div>
                        <span className="font-bold text-gray-900 text-base">IslandShipping</span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <a href="/" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            Home
                        </a>
                        <a href="/schedule" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            Schedules
                        </a>
                        <a href="/routefare" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            Fares
                        </a>
                        {user && (
                            <Link href={route('dashboard')} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Log Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Burger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                </div>

                {/* Mobile Dropdown */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">

                        {/* User Info (if logged in) */}
                        {user && (
                            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Nav Links */}
                        <div className="px-3 py-2 space-y-1">
                            <a href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                🏠 Home
                            </a>
                            <a href="/schedule" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                📅 Schedules
                            </a>
                            <a href="/route" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                � Our Route
                            </a>
                            <a href="/routefare" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                💰 Fares
                            </a>

                            {/* Authenticated Links */}
                            {user && (
                                <>
                                    <Link href={route('dashboard')} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                        📊 Dashboard
                                    </Link>
                                    <Link href={route('profile.edit')} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                                        👤 Profile
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Bottom Auth Buttons */}
                        <div className="px-3 pb-3 pt-1 border-t border-gray-100 mt-1">
                            {user ? (
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    🚪 Log Out
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={route('login')}
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full py-3 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full py-3 text-center text-sm font-medium text-white bg-green-700 rounded-xl hover:bg-green-800 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main>{children}</main>

        </div>
    );
}