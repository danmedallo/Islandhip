import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

const routeColors = {
    "Hagnaya, San Remigio, Cebu → Sta. Fe, Bantayan Island":  { dot: "bg-green-500",  text: "text-green-700",  badge: "bg-green-100"  },
    "Sta. Fe, Bantayan Island → Hagnaya, San Remigio, Cebu":  { dot: "bg-teal-500",   text: "text-teal-700",   badge: "bg-teal-100"   },
    "Hagnaya, San Remigio, Cebu → Cawayan, Masbate":          { dot: "bg-blue-500",   text: "text-blue-700",   badge: "bg-blue-100"   },
    "Cawayan, Masbate → Hagnaya, San Remigio, Cebu":          { dot: "bg-indigo-500", text: "text-indigo-700", badge: "bg-indigo-100" },
    "Tangil, Dumanjug, Cebu → Bulado, Guihulngan, Negros":    { dot: "bg-amber-500",  text: "text-amber-700",  badge: "bg-amber-100"  },
    "Bulado, Guihulngan, Negros → Tangil, Dumanjug, Cebu":    { dot: "bg-orange-500", text: "text-orange-700", badge: "bg-orange-100" },
};

const defaultColor = { dot: "bg-gray-400", text: "text-gray-600", badge: "bg-gray-100" };

export default function Schedules({ auth, schedules }) {
    const today = new Date().toISOString().split("T")[0];

    const [from, setFrom]     = useState("");
    const [to, setTo]         = useState("");
    const [date, setDate]     = useState("");
    const [filtered, setFiltered] = useState(null);

    const origins = [...new Set(schedules.map((s) => s.origin))];
    const destinations = [...new Set(schedules.map((s) => s.destination))];

    const handleSearch = () => {
        let results = schedules;
        if (from) results = results.filter((s) => s.origin === from);
        if (to)   results = results.filter((s) => s.destination === to);
        if (date) {
            results = results.filter((s) => {
                const tripDate = new Date(s.trip_date)
                    .toISOString()
                    .split("T")[0];

                return tripDate === date;
            });
        }
        setFiltered(results);
    };

    const handleReset = () => {
        setFrom("");
        setTo("");
        setDate("");
        setFiltered(null);
    };

    const display = filtered !== null ? filtered : schedules;

    const getColor = (origin, destination) =>
        routeColors[`${origin} → ${destination}`] ?? defaultColor;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Daily";

    return (
        <>
            <Head title="Ferry Schedules" />

            <div className="min-h-screen bg-gray-50">

                {/* Navbar */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <a href="/" className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center text-white text-lg">⚓</a>
                            <span className="font-bold text-gray-900 text-lg">IslandShip</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                            <a href="/" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">Home</a>
                            <a href="/schedules" className="px-3 py-2 text-sm text-green-700 font-semibold rounded-lg bg-green-50">Schedules</a>
                            <a href="#fares" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">Fares</a>
                        </div>
                        <div className="flex items-center gap-2">
                            {auth?.user ? (
                                <Link href={route("dashboard")} className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={route("login")} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Log in</Link>
                                    <Link href={route("register")} className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <div className="bg-gradient-to-br from-green-900 via-green-700 to-teal-600 px-4 pt-10 pb-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">⚓ Island Shipping Corporation</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>Ferry Schedules</h1>
                        <p className="text-white/70 text-sm">Browse and filter all available trips by route and date</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
                            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 -mt-8 pb-16">

                    {/* Filter Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6 mt-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">🔍 Filter Trips</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">From</label>
                                <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">All origins</option>
                                    {origins.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">To</label>
                                <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">All destinations</option>
                                    {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSearch} className="flex-1 h-10 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors">
                                    🔍 Search
                                </button>
                                <button onClick={handleReset} className="h-10 px-4 border border-gray-200 text-gray-400 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-0.5">Trip schedules</p>
                            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                                {filtered !== null
                                    ? `${filtered.length} trip${filtered.length !== 1 ? "s" : ""} found`
                                    : `${schedules.length} total trips`}
                            </h2>
                        </div>
                        {filtered !== null && (
                            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline">
                                Clear filters
                            </button>
                        )}
                    </div>

                    {/* No Results */}
                    {display.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
                            <p className="text-5xl mb-3">⛵</p>
                            <p className="text-gray-500 text-sm font-medium">No schedules found.</p>
                            <p className="text-gray-400 text-xs mt-1 mb-4">Try changing the route or date.</p>
                            <button onClick={handleReset} className="text-sm text-green-700 font-semibold hover:underline">Reset filters</button>
                        </div>
                    )}

                    {/* Schedule List Table */}
                    {display.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</div>
                                <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Route</div>
                                <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vessel</div>
                                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</div>
                                <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Time</div>
                                <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Duration</div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-gray-100">
                                {display.map((trip, i) => {
                                    const color = getColor(trip.origin, trip.destination);
                                    return (
                                        <div key={trip.id ?? i} className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">

                                            {/* # */}
                                            <div className="col-span-1">
                                                <span className="text-xs text-gray-300 font-mono">{i + 1}</span>
                                            </div>

                                            {/* Route */}
                                            <div className="col-span-4 flex items-center gap-2.5">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color.dot}`} />
                                                <div>
                                                    <p className={`text-xs font-semibold ${color.text} leading-tight`}>{trip.origin.split(",")[0]}</p>
                                                    <p className="text-xs text-gray-400 leading-tight">→ {trip.destination.split(",")[0]}</p>
                                                </div>
                                            </div>

                                            {/* Vessel */}
                                            <div className="col-span-3">
                                                <p className="text-xs text-gray-700">{trip.vessel}</p>
                                            </div>

                                            {/* Date */}
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500">{formatDate(trip.trip_date)}</p>
                                            </div>

                                            {/* Time */}
                                            <div className="col-span-1 text-center">
                                                <span className={`text-sm font-bold ${color.text}`} style={{ fontFamily: "'Georgia', serif" }}>
                                                    {trip.time ?? "—"}
                                                </span>
                                            </div>

                                            {/* Duration */}
                                            <div className="col-span-1 text-right">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.badge} ${color.text}`}>
                                                    {trip.duration ?? "—"}
                                                </span>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                            {/* Table Footer */}
                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    Showing <span className="font-semibold text-gray-600">{display.length}</span> trip{display.length !== 1 ? "s" : ""}
                                </p>
                                <p className="text-xs text-gray-400">
                                    ⚠️ Schedules may change without prior notice
                                </p>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}