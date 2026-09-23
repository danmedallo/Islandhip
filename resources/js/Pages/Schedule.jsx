
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

const routeColors = {
    "Hagnaya, San Remigio, Cebu → Sta. Fe, Bantayan Island":  { dot: "bg-green-500",  text: "text-green-700",  badge: "bg-green-100"  },
    "Sta. Fe, Bantayan Island → Hagnaya, San Remigio, Cebu":  { dot: "bg-teal-500",   text: "text-teal-700",   badge: "bg-teal-100"   },
    "Hagnaya, San Remigio, Cebu → Cawayan, Masbate":          { dot: "bg-blue-500",   text: "text-blue-700",   badge: "bg-blue-100"   },
    "Cawayan, Masbate → Hagnaya, San Remigio, Cebu":          { dot: "bg-indigo-500", text: "text-indigo-700", badge: "bg-indigo-100" },
    "Tangil, Dumanjug, Cebu → Bulado, Guihulngan, Negros":    { dot: "bg-amber-500",  text: "text-amber-700",  badge: "bg-amber-100"  },
    "Bulado, Guihulngan, Negros → Tangil, Dumanjug, Cebu":    { dot: "bg-orange-500", text: "text-orange-700", badge: "bg-orange-100" },
};

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

const defaultColor = { dot: "bg-gray-400", text: "text-gray-600", badge: "bg-gray-100" };

export default function Schedule({ schedules, filters = {} }) {
    const [from, setFrom] = useState(filters.from ?? "");
    const [to, setTo]     = useState(filters.to ?? "");
    const [date, setDate] = useState(filters.date ?? "");

    const handleSearch = () => {
        const params = {};
        if (from) params.from = from;
        if (to)   params.to   = to;
        if (date) params.date = date;
        router.get("/schedule", params, { preserveScroll: true });
    };

    const handleReset = () => {
        setFrom("");
        setTo("");
        setDate("");
        router.get("/schedule", {}, { preserveState: false, replace: true });
    };

    const display        = schedules.data ?? [];
    const current_page   = schedules.current_page ?? 1;
    const last_page      = schedules.last_page ?? 1;
    const total          = schedules.total ?? 0;

    const getColor = (origin, destination) =>
        routeColors[`${origin} → ${destination}`] ?? defaultColor;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-PH", {
            weekday: "short", month: "short", day: "numeric", year: "numeric",
        }) : "Daily";

    const goToPage = (page) => {
        if (page < 1 || page > last_page) return;
        const params = { page };
        if (filters.from) params.from = filters.from;
        if (filters.to)   params.to   = filters.to;
        if (filters.date) params.date = filters.date;
        router.get("/schedule", params, { preserveScroll: true });
    };

    const hasFilters = filters.from || filters.to || filters.date;

    return (
        <AppLayout>
            <Head title="Ferry Schedules" />

            <div className="min-h-screen bg-gray-50">

                {/* Hero */}
                <div className="bg-gradient-to-br from-green-900 via-green-700 to-teal-600 px-4 pt-10 pb-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">⚓ Island Shipping Corporation</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                            Ferry Schedules
                        </h1>
                        <p className="text-white/70 text-sm">Browse and filter all available trips</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
                            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 -mt-6 pb-20">

                    {/* Filter Card */}
                    <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">🔍 Filter Trips</p>
                        <div className="space-y-3">
                            {/* From */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">From</label>
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full h-11 border border-gray-200 rounded-xl text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">All origins</option>
                                    {origins.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>

                            {/* To */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">To</label>
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full h-11 border border-gray-200 rounded-xl text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">All destinations</option>
                                    {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-11 border border-gray-200 rounded-xl text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={handleSearch}
                                    className="flex-1 h-11 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
                                >
                                    Search
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="h-11 px-5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-0.5">Trip schedules</p>
                            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                                {total} trip{total !== 1 ? "s" : ""} {hasFilters ? "found" : "total"}
                            </h2>
                        </div>
                        {hasFilters && (
                            <button onClick={handleReset} className="text-xs text-gray-500 hover:text-gray-700 underline">
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
                            <button onClick={handleReset} className="text-sm text-green-700 font-semibold hover:underline">
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Schedule List — Mobile Card Style */}
                    {display.length > 0 && (
                        <div className="space-y-3">
                            {display.map((trip, i) => {
                                const color    = getColor(trip.origin, trip.destination);
                                const rowNumber = (current_page - 1) * 15 + i + 1;

                                return (
                                    <Link
                                        key={trip.id ?? i}
                                        href={`/scheduleDetails/${trip.id}`}
                                        className="block bg-white border border-gray-200 rounded-2xl px-4 py-4 cursor-pointer hover:border-green-300 hover:shadow-sm transition-all active:scale-[0.99]"
                                    >
                                        <div className="flex items-center justify-between">

                                            {/* Left — Route */}
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                {/* Number */}
                                                <span className="text-xs text-gray-300 font-mono w-5 flex-shrink-0">
                                                    {rowNumber}
                                                </span>

                                                {/* Color dot + route */}
                                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.dot}`} />
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-bold ${color.text} leading-tight truncate`}>
                                                        {trip.origin.split(",")[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-400 leading-tight truncate">
                                                        → {trip.destination.split(",")[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        📅 {formatDate(trip.trip_date)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right — Time + Duration */}
                                            <div className="text-right flex-shrink-0 ml-3">
                                                <p
                                                    className={`text-lg font-bold ${color.text}`}
                                                    style={{ fontFamily: "'Georgia', serif" }}
                                                >
                                                    {trip.time ?? "—"}
                                                </p>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.badge} ${color.text}`}>
                                                    {trip.duration ?? "—"}
                                                </span>
                                            </div>

                                            {/* Arrow */}
                                            <div className="ml-3 text-gray-300 flex-shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>

                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Pagination */}
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-4">
                                <p className="text-xs text-gray-400 text-center mb-3">
                                    ⚠️ Schedules may change without prior notice
                                </p>

                                {last_page > 1 && (
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => goToPage(current_page - 1)}
                                            disabled={current_page === 1}
                                            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                                current_page === 1
                                                    ? "text-gray-300 cursor-not-allowed"
                                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                                            }`}
                                        >
                                            ← Prev
                                        </button>

                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-800">
                                                {current_page} / {last_page}
                                            </p>
                                            <p className="text-xs text-gray-400">{total} trips</p>
                                        </div>

                                        <button
                                            onClick={() => goToPage(current_page + 1)}
                                            disabled={current_page === last_page}
                                            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                                current_page === last_page
                                                    ? "text-gray-300 cursor-not-allowed"
                                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                                            }`}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}