import { Head, Link } from "@inertiajs/react";
const routes = [
    {
        name: "Bantayan Island",
        from: "Hagnaya, Cebu",
        to: "Sta. Fe",
        duration: "~2h",
        fare: "₱300",
        icon: "🏝️",
    },
    {
        name: "Masbate",
        from: "Hagnaya, Cebu",
        to: "Cawayan",
        duration: "~4h",
        fare: "₱475",
        icon: "⛵",
    },
    {
        name: "Negros",
        from: "Tangil, Dumanjug",
        to: "Bulado",
        duration: "~2h",
        fare: "₱290",
        icon: "🗺️",
    },
];
export default function Route({ auth }) {

return (
    <>
    {/* Navbar */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center text-white text-lg">
                                <a href="/">⚓</a>
                            </div>
                            <span className="font-bold text-gray-900 text-lg tracking-tight">
                                IslandShip
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                            <a href="#routes" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                                Routes
                            </a>
                            <a href="#schedules" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                                Schedules
                            </a>
                            <a href="#fares" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                                Fares
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            {auth?.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
                {/* Hero */}
                <div className="bg-gradient-to-br from-green-900 via-green-700 to-teal-600 px-4 pt-10 pb-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">⚓ Our routes</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>Popular destinations</h1>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
                            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>
     {/* Routes */}
                     {/* Stats */}
                <section className="max-w-6xl mx-auto px-4 mt-3 pb-6">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { num: "3", label: "Routes" },
                            { num: "31+", label: "Daily trips" },
                            { num: "365", label: "Days/year" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="bg-white border border-gray-200 rounded-xl p-5 text-center"
                            >
                                <p className="text-3xl font-bold text-green-700"
                                   style={{ fontFamily: "'Georgia', serif" }}>
                                    {s.num}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section id="routes" className="max-w-6xl mx-auto px-4 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {routes.map((r) => (
                            <div
                                key={r.name}
                                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-sm transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl mb-4">
                                    {r.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{r.name}</h3>
                                <p className="text-xs text-gray-500 mb-1">
                                    {r.from} → {r.to}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-400">{r.duration}</span>
                                    <span className="text-sm font-semibold text-green-700">
                                        From {r.fare}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
    </>
)
}
