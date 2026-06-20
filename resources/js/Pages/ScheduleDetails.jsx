import { Head, Link } from "@inertiajs/react";

const routeColors = {
    "Hagnaya, San Remigio, Cebu → Sta. Fe, Bantayan Island":  { dot: "bg-green-500",  text: "text-green-700",  badge: "bg-green-100",  bg: "bg-green-50",  border: "border-green-200", active: "bg-green-700" },
    "Sta. Fe, Bantayan Island → Hagnaya, San Remigio, Cebu":  { dot: "bg-teal-500",   text: "text-teal-700",   badge: "bg-teal-100",   bg: "bg-teal-50",   border: "border-teal-200",  active: "bg-teal-700"  },
    "Hagnaya, San Remigio, Cebu → Cawayan, Masbate":          { dot: "bg-blue-500",   text: "text-blue-700",   badge: "bg-blue-100",   bg: "bg-blue-50",   border: "border-blue-200",  active: "bg-blue-700"  },
    "Cawayan, Masbate → Hagnaya, San Remigio, Cebu":          { dot: "bg-indigo-500", text: "text-indigo-700", badge: "bg-indigo-100", bg: "bg-indigo-50", border: "border-indigo-200",active: "bg-indigo-700"},
    "Tangil, Dumanjug, Cebu → Bulado, Guihulngan, Negros":    { dot: "bg-amber-500",  text: "text-amber-700",  badge: "bg-amber-100",  bg: "bg-amber-50",  border: "border-amber-200", active: "bg-amber-700" },
    "Bulado, Guihulngan, Negros → Tangil, Dumanjug, Cebu":    { dot: "bg-orange-500", text: "text-orange-700", badge: "bg-orange-100", bg: "bg-orange-50", border: "border-orange-200",active: "bg-orange-700"},
};

const defaultColor = { dot: "bg-gray-400", text: "text-gray-600", badge: "bg-gray-100", bg: "bg-gray-50", border: "border-gray-200", active: "bg-gray-700" };

const portInfo = {
    "Hagnaya, San Remigio, Cebu": {
        address: "Hagnaya Port, San Remigio, Cebu",
        tip: "Arrive at least 1 hour before departure. Parking available near the port.",
        maps: "https://maps.google.com/?q=Hagnaya+Port+San+Remigio+Cebu",
    },
    "Sta. Fe, Bantayan Island": {
        address: "Sta. Fe Port, Bantayan Island, Cebu",
        tip: "Port is in the town center. Tricycles available from the port.",
        maps: "https://maps.google.com/?q=Sta+Fe+Port+Bantayan+Island",
    },
    "Cawayan, Masbate": {
        address: "Cawayan Port, Masbate",
        tip: "Longer trip — bring food and water. Port has basic facilities.",
        maps: "https://maps.google.com/?q=Cawayan+Port+Masbate",
    },
    "Tangil, Dumanjug, Cebu": {
        address: "Tangil Port, Dumanjug, Cebu",
        tip: "About 3 hours from Cebu City. Take the south road via Carcar.",
        maps: "https://maps.google.com/?q=Tangil+Port+Dumanjug+Cebu",
    },
    "Bulado, Guihulngan, Negros": {
        address: "Bulado Port, Guihulngan, Negros Oriental",
        tip: "Port is accessible from Guihulngan City proper via habal-habal.",
        maps: "https://maps.google.com/?q=Bulado+Port+Guihulngan+Negros",
    },
};

export default function ScheduleDetail({ auth, schedule }) {
    const routeKey = `${schedule.origin} → ${schedule.destination}`;
    const color = routeColors[routeKey] ?? defaultColor;

    const originPort = portInfo[schedule.origin] ?? null;
    const destPort = portInfo[schedule.destination] ?? null;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-PH", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
        }) : "Daily";

    return (
        <>
            <Head title={`Trip Detail — ${schedule.origin} → ${schedule.destination}`} />

            <div className="min-h-screen bg-gray-50">

                {/* Navbar */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <a href="/" className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center text-white text-lg">⚓</a>
                            <span className="font-bold text-gray-900 text-base">IslandShip</span>
                        </div>
                        <Link
                            href="/schedule"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            ← Back to Schedules
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <div className={`${color.active} px-4 pt-8 pb-20 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-3">⚓ Trip Detail</p>

                        {/* Route */}
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-white font-bold text-lg leading-tight">{schedule.origin.split(",")[0]}</span>
                            <span className="text-white/60 text-xl">→</span>
                            <span className="text-white font-bold text-lg leading-tight">{schedule.destination.split(",")[0]}</span>
                        </div>
                        <p className="text-white/70 text-sm">{schedule.origin} → {schedule.destination}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
                            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 -mt-6 pb-20 space-y-4">

                    {/* Trip Summary Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm py-6">
                        <div className={`${color.bg} ${color.border} border-b px-5 py-3`}>
                            <p className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>🎫 Trip Summary</p>
                        </div>
                        <div className="divide-y divide-gray-100">

                            {/* Departure Time */}
                            <div className="flex items-center justify-between px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🕐</span>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Departure Time</p>
                                        <p className={`text-2xl font-bold ${color.text} mt-0.5`} style={{ fontFamily: "'Georgia', serif" }}>
                                            {schedule.time ?? "—"}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${color.badge} ${color.text}`}>
                                    {schedule.duration ?? "—"}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-3 px-5 py-4">
                                <span className="text-xl">📅</span>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Trip Date</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatDate(schedule.trip_date)}</p>
                                </div>
                            </div>

                            {/* Vessel */}
                            <div className="flex items-center gap-3 px-5 py-4">
                                <span className="text-xl">🚢</span>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Vessel</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{schedule.vessel ?? "—"}</p>
                                </div>
                            </div>

                            {/* Trip Type */}
                            <div className="flex items-center gap-3 px-5 py-4">
                                <span className="text-xl">⚓</span>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Service Type</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">RORO Ferry Service</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Route Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className={`${color.bg} ${color.border} border-b px-5 py-3`}>
                            <p className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>📍 Route Details</p>
                        </div>

                        {/* Origin */}
                        <div className="px-5 py-4 border-b border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center mt-1">
                                    <div className={`w-3 h-3 rounded-full ${color.dot}`} />
                                    <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Origin</p>
                                    <p className="text-sm font-bold text-gray-800">{schedule.origin}</p>
                                    {originPort && (
                                        <>
                                            <p className="text-xs text-gray-500 mt-1">{originPort.address}</p>
                                            <p className="text-xs text-gray-400 mt-1 italic">💡 {originPort.tip}</p>
                                            <a href={originPort.maps} target="_blank" rel="noreferrer" className={`text-xs font-semibold ${color.text} mt-2 inline-flex items-center gap-1 hover:underline`}>
                                                📍 View on Maps →
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center mt-1">
                                    <div className={`w-3 h-3 rounded-full border-2 ${color.border} bg-white`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Destination</p>
                                    <p className="text-sm font-bold text-gray-800">{schedule.destination}</p>
                                    {destPort && (
                                        <>
                                            <p className="text-xs text-gray-500 mt-1">{destPort.address}</p>
                                            <p className="text-xs text-gray-400 mt-1 italic">💡 {destPort.tip}</p>
                                            <a href={destPort.maps} target="_blank" rel="noreferrer" className={`text-xs font-semibold ${color.text} mt-2 inline-flex items-center gap-1 hover:underline`}>
                                                📍 View on Maps →
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className={`${color.bg} ${color.border} border-b px-5 py-3`}>
                            <p className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>💡 Travel Tips</p>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            {[
                                { icon: "⏰", tip: "Arrive at the port at least 1 hour before departure." },
                                { icon: "🎫", tip: "Keep your ticket ready for boarding." },
                                { icon: "🧳", tip: "Label your luggage clearly with your name and contact number." },
                                { icon: "🚗", tip: "If bringing a vehicle, arrive 1.5 hours early for loading." },
                                { icon: "⛅", tip: "Check weather conditions before traveling during typhoon season." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="text-base mt-0.5">{item.icon}</span>
                                    <p className="text-sm text-gray-600 leading-snug">{item.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className={`${color.bg} ${color.border} border-b px-5 py-3`}>
                            <p className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>📞 Contact</p>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-base">📞</span>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Phone</p>
                                    <p className="text-sm font-semibold text-gray-800">(032) 266-0718 · (032) 340-6453</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-base">✉️</span>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Email</p>
                                    <p className="text-sm font-semibold text-gray-800">info@islandshipping.com.ph</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Link
                            href="/schedules"
                            className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 transition-colors"
                        >
                            ← Back to Schedules
                        </Link>
                        <a
                            href="/fares"
                            className={`flex-1 py-3.5 ${color.active} text-white rounded-xl text-sm font-semibold text-center hover:opacity-90 transition-opacity`}
                        >
                            View Fares →
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}