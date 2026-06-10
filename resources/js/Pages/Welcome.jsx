import { Head, Link } from "@inertiajs/react";



const upcomingTrips = [
    {
        route: "Hagnaya → Sta. Fe",
        vessel: "MV Island Ventures III",
        time: "1:30 PM",
        duration: "2h",
    },
    {
        route: "Hagnaya → Sta. Fe",
        vessel: "MV Island Ventures V",
        time: "3:30 PM",
        duration: "2h",
    },
    {
        route: "Sta. Fe → Hagnaya",
        vessel: "MV Island Ventures VII",
        time: "5:30 PM",
        duration: "2h",
    },
];

const origins = [
    "Hagnaya, San Remigio, Cebu",
    "Sta. Fe, Bantayan Island",
    "Tangil, Dumanjug, Cebu",
    "Bulado, Guihulngan, Negros",
    "Cawayan, Masbate",
];

const destinations = [
    "Sta. Fe, Bantayan Island",
    "Hagnaya, San Remigio, Cebu",
    "Cawayan, Masbate",
    "Bulado, Guihulngan, Negros",
    "Tangil, Dumanjug, Cebu",
];

export default function Welcome({ auth, todaysTrip }) {
    const today = new Date().toISOString().split("T")[0];
    console.log(todaysTrip)
    return (
        <>
            <Head title="Island Shipping Corporation" />

            <div className="min-h-screen bg-gray-50 font-sans">

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
                <section className="relative bg-gradient-to-br from-green-900 via-green-700 to-teal-600 py-20 px-4 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                            backgroundSize: "20px 20px",
                        }}
                    />
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <div className="max-w-2xl">
                            <span className="inline-block bg-white/15 text-white text-xs px-3 py-1.5 rounded-full mb-4 tracking-wide">
                                ⚓ RORO Ferry Service — Visayas
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
                                style={{ fontFamily: "'Georgia', serif" }}>
                                Sail the Visayas <br />
                                <span className="text-green-200">with ease</span>
                            </h1>
                            <p className="text-white/80 text-lg mb-8 max-w-xl leading-relaxed">
                                Reliable ferry service connecting Cebu to Bantayan Island,
                                Masbate, and Negros. Daily trips, affordable fares.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="#search"
                                    className="px-6 py-3 bg-white text-green-800 font-semibold rounded-xl hover:bg-green-50 transition-colors text-sm"
                                >
                                    🎫 Book a Trip
                                </a>
                                <Link
                                    href={route('schedule')}
                                    className="px-6 py-3 border border-white/40 text-white rounded-xl hover:bg-white/10 transition-colors text-sm"
                                >
                                    View Schedules
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12">
                            <path
                                d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                                fill="#f9fafb"
                            />
                        </svg>
                    </div>
                </section>

                {/* Search */}
                <section id="search" className="max-w-6xl mx-auto px-4 -mt-2 pb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                            🔍 Find a Trip
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    From
                                </label>
                                <select className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">Select origin</option>
                                    {origins.map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    To
                                </label>
                                <select className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">Select destination</option>
                                    {destinations.map((d) => (
                                        <option key={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    defaultValue={today}
                                    className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <button className="h-10 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
                                🔍 Search Trips
                            </button>
                        </div>
                    </div>
                </section>

                {/* Today's Schedules */}
                <section id="schedules" className="max-w-6xl mx-auto px-4 pb-16">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">
                        Today's trips
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6"
                        style={{ fontFamily: "'Georgia', serif" }}>
                        Upcoming departures
                    </h2>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        {todaysTrip.map((trip, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                                    i !== todaysTrip.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {trip.origin.split(",")[0]} → {trip.destination.split(",")[0]}
                                        </p>
                                        <p className="text-xs text-gray-500">{trip.vessel}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-green-700"
                                       style={{ fontFamily: "'Georgia', serif" }}>
                                        {trip.time}
                                    </p>
                                    <p className="text-xs text-gray-400">{trip.duration} trip</p>
                                </div>
                            </div>
                        ))}
                        
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                            <Link
                                href={route("schedule")}
                                className="text-sm text-green-700 font-medium hover:underline"
                            >
                                View all schedules →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-green-900 text-white py-10 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
                                ⚓
                            </div>
                            <span className="font-bold text-lg">Island Shipping Corporation</span>
                        </div>
                        <p className="text-green-300 text-sm italic mb-4">
                            "We Sail for the glory of God and Country"
                        </p>
                        <p className="text-green-400 text-xs">
                            A.T. TAN Centre Road 6, North Reclamation Area, Cebu City · (032) 266-0718
                        </p>
                        <div className="border-t border-white/10 mt-6 pt-4">
                            <p className="text-green-500 text-xs text-center">
                                © {new Date().getFullYear()} Island Shipping Corporation. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}