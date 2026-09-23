import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import useOnline from '@/Hooks/useOnline';

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
    const online = useOnline();

    const [from, setFrom]     = useState("");
    const [to, setTo]         = useState("");
    const [date, setDate]     = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from || !to || !date) {
            alert("Please fill in all fields.");
            return;
        }
        const searchParams = new URLSearchParams({ from, to, date });
        window.location.href = `/schedule?${searchParams.toString()}`;


    };
    return (
        <AppLayout>
    
            <Head title="Island Shipping Corporation" />

            <div className="min-h-screen bg-gray-50 font-sans">

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
                                {online ? (
                                    <a
                                        href="/book"
                                        className="px-6 py-3 bg-white text-green-800 font-semibold rounded-xl hover:bg-green-50 transition-colors text-sm"
                                    >
                                        🎫 Book a Trip
                                    </a>
                                ) : (
                                    <span
                                        className="px-6 py-3 bg-white/40 text-white/70 font-semibold rounded-xl text-sm cursor-not-allowed"
                                        title="Booking needs a connection"
                                    >
                                        🎫 Book a Trip — offline
                                    </span>
                                )}
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
                                <select onChange={(e) => setFrom(e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="{from}">
                                        Select origin
                                    </option>
                                    {origins.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    To
                                </label>
                                <select onChange={(e) => setTo(e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="{to}">
                                        Select destination
                                    </option>
                                    {destinations.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-10 border border-gray-200 rounded-lg text-sm px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <button onClick={handleSearch} className="h-10 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
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
                            <Link
                                key={i}
                                href={`/scheduleDetails/${trip.id}`}
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
                            </Link>
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

            </div>
        
        </ AppLayout>
    );
}