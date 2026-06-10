import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

const fareData = {
    bantayan: {
        label: "Bantayan Island",
        icon: "🏝️",
        route: "Hagnaya, San Remigio, Cebu ↔ Sta. Fe, Bantayan Island",
        duration: "~1–2 hours",
        color: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500", active: "bg-green-700" },
        passengers: [
            { type: "Regular", fare: 300 },
            { type: "Senior Citizen (with ID)", fare: 214 },
            { type: "Student (with valid ID)", fare: 240 },
            { type: "Child (11 yrs & below)", fare: 150 },
        ],
        vehicles: [
            { type: "12W / 10W / 6W Extended", fare: 5500 },
            { type: "6W Fighter / Forward", fare: 3200 },
            { type: "6W Elf Canter", fare: 2800 },
            { type: "6W Bongo / 4W Bongo / Van Extended", fare: 2300 },
            { type: "SUV / Pick Up / Wagon", fare: 2100 },
            { type: "Sedan / Hatchback", fare: 1400 },
        ],
        motorcycles: [
            { type: "200cc & below", fare: 650 },
            { type: "200cc – 650cc", fare: 800 },
            { type: "700cc – 1000cc", fare: 1100 },
        ],
        heavy: [
            { type: "7 Tons & Below", fare: 5700 },
            { type: "15 Tons & Below", fare: 8000 },
            { type: "Above 15 Tons", fare: 15000 },
            { type: "20 Footers", fare: 7900 },
            { type: "30 Footers", fare: 9200 },
            { type: "40 Footers", fare: 11000 },
        ],
    },
    masbate: {
        label: "Masbate",
        icon: "⛵",
        route: "Hagnaya, San Remigio, Cebu ↔ Cawayan, Masbate",
        duration: "~3–4 hours",
        color: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", active: "bg-blue-700" },
        passengers: [
            { type: "Regular", fare: 475 },
            { type: "Senior Citizen (with ID)", fare: 339 },
            { type: "Student (with valid ID)", fare: 380 },
            { type: "Child (11 yrs & below)", fare: 238 },
        ],
        vehicles: [
            { type: "12W / 10W / 6W Extended", fare: 7500 },
            { type: "6W Fighter / Forward", fare: 5200 },
            { type: "6W Elf Canter", fare: 4500 },
            { type: "6W Bongo / 4W Bongo / Van Extended", fare: 3800 },
            { type: "SUV / Pick Up / Wagon", fare: 3200 },
            { type: "Sedan / Hatchback", fare: 2500 },
        ],
        motorcycles: [
            { type: "200cc & below", fare: 950 },
            { type: "200cc – 650cc", fare: 1200 },
            { type: "700cc – 1000cc", fare: 1600 },
        ],
        heavy: [
            { type: "7 Tons & Below", fare: 8500 },
            { type: "15 Tons & Below", fare: 12000 },
            { type: "Above 15 Tons", fare: 20000 },
            { type: "20 Footers", fare: 11000 },
            { type: "30 Footers", fare: 14000 },
            { type: "40 Footers", fare: 17000 },
        ],
    },
    negros: {
        label: "Negros",
        icon: "🗺️",
        route: "Tangil, Dumanjug, Cebu ↔ Bulado, Guihulngan, Negros",
        duration: "~1–2 hours",
        color: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", active: "bg-amber-700" },
        passengers: [
            { type: "Regular", fare: 290 },
            { type: "Senior Citizen (with ID)", fare: 207 },
            { type: "Student (with valid ID)", fare: 232 },
            { type: "Child (11 yrs & below)", fare: 145 },
        ],
        vehicles: [
            { type: "12W / 10W / 6W Extended", fare: 5000 },
            { type: "6W Fighter / Forward", fare: 3000 },
            { type: "6W Elf Canter", fare: 2600 },
            { type: "6W Bongo / 4W Bongo / Van Extended", fare: 2100 },
            { type: "SUV / Pick Up / Wagon", fare: 1900 },
            { type: "Sedan / Hatchback", fare: 1300 },
        ],
        motorcycles: [
            { type: "200cc & below", fare: 600 },
            { type: "200cc – 650cc", fare: 750 },
            { type: "700cc – 1000cc", fare: 1000 },
        ],
        heavy: [
            { type: "7 Tons & Below", fare: 5200 },
            { type: "15 Tons & Below", fare: 7500 },
            { type: "Above 15 Tons", fare: 14000 },
            { type: "20 Footers", fare: 7200 },
            { type: "30 Footers", fare: 8500 },
            { type: "40 Footers", fare: 10500 },
        ],
    },
};

function FareSection({ title, emoji, rows, color }) {
    return (
        <div className="mb-5">
            <p className={`text-xs font-bold uppercase tracking-wide ${color.text} mb-3`}>
                {emoji} {title}
            </p>
            <div className={`rounded-xl border ${color.border} overflow-hidden`}>
                {rows.map((row, i) => (
                    <div
                        key={i}
                        className={`flex items-center justify-between px-4 py-3 ${
                            i !== rows.length - 1 ? "border-b border-gray-100" : ""
                        } ${i % 2 === 0 ? "bg-white" : color.bg}`}
                    >
                        <span className="text-sm text-gray-700 flex-1 pr-4">{row.type}</span>
                        <span className={`text-sm font-bold ${color.text} whitespace-nowrap`}>
                            ₱{row.fare.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FareCalculator({ data }) {
    const [passengerType, setPassengerType] = useState("");
    const [passengerCount, setPassengerCount] = useState(1);
    const [vehicleType, setVehicleType] = useState("");
    const [motoType, setMotoType] = useState("");
    const [result, setResult] = useState(null);

    const c = data.color;

    const calculate = () => {
        let total = 0;
        let breakdown = [];

        if (passengerType) {
            const p = data.passengers.find((p) => p.type === passengerType);
            if (p) {
                const subtotal = p.fare * passengerCount;
                total += subtotal;
                breakdown.push({ label: `${passengerCount}x ${p.type}`, amount: subtotal });
            }
        }
        if (vehicleType) {
            const v = data.vehicles.find((v) => v.type === vehicleType);
            if (v) {
                total += v.fare;
                breakdown.push({ label: v.type, amount: v.fare });
            }
        }
        if (motoType) {
            const m = data.motorcycles.find((m) => m.type === motoType);
            if (m) {
                total += m.fare;
                breakdown.push({ label: `Motorcycle (${m.type})`, amount: m.fare });
            }
        }
        setResult({ total, breakdown });
    };

    const reset = () => {
        setPassengerType("");
        setPassengerCount(1);
        setVehicleType("");
        setMotoType("");
        setResult(null);
    };

    return (
        <div className={`${c.bg} border ${c.border} rounded-2xl p-4 mb-5`}>
            <p className={`text-xs font-bold uppercase tracking-wide ${c.text} mb-4`}>
                🧮 Fare Calculator
            </p>

            {/* Passenger Type */}
            <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Passenger Type
                </label>
                <select
                    value={passengerType}
                    onChange={(e) => setPassengerType(e.target.value)}
                    className="w-full h-11 border border-gray-200 rounded-xl text-sm px-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Select type</option>
                    {data.passengers.map((p) => (
                        <option key={p.type} value={p.type}>
                            {p.type} — ₱{p.fare.toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Passenger Count */}
            <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    No. of Passengers
                </label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                        className="w-11 h-11 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 text-lg font-bold"
                    >
                        −
                    </button>
                    <span className="text-xl font-bold text-gray-800 w-10 text-center">{passengerCount}</span>
                    <button
                        onClick={() => setPassengerCount(passengerCount + 1)}
                        className="w-11 h-11 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 text-lg font-bold"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Vehicle */}
            <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Vehicle (optional)
                </label>
                <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full h-11 border border-gray-200 rounded-xl text-sm px-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">None</option>
                    {data.vehicles.map((v) => (
                        <option key={v.type} value={v.type}>
                            {v.type} — ₱{v.fare.toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Motorcycle */}
            <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Motorcycle (optional)
                </label>
                <select
                    value={motoType}
                    onChange={(e) => setMotoType(e.target.value)}
                    className="w-full h-11 border border-gray-200 rounded-xl text-sm px-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">None</option>
                    {data.motorcycles.map((m) => (
                        <option key={m.type} value={m.type}>
                            {m.type} — ₱{m.fare.toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={calculate}
                    className={`flex-1 h-11 ${c.active} text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity`}
                >
                    Calculate Total
                </button>
                <button
                    onClick={reset}
                    className="h-11 px-4 border border-gray-200 bg-white text-gray-400 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Breakdown
                    </p>
                    {result.breakdown.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2">
                            Select at least one item to calculate.
                        </p>
                    ) : (
                        <>
                            <div className="space-y-2 mb-3">
                                {result.breakdown.map((b, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{b.label}</span>
                                        <span className="font-semibold text-gray-800">
                                            ₱{b.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className={`flex justify-between items-center pt-3 border-t ${c.border}`}>
                                <span className={`text-sm font-bold ${c.text}`}>Total</span>
                                <span
                                    className={`text-2xl font-bold ${c.text}`}
                                    style={{ fontFamily: "'Georgia', serif" }}
                                >
                                    ₱{result.total.toLocaleString()}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function RouteFare({ auth }) {
    const [activeRoute, setActiveRoute] = useState("bantayan");
    const [showCalculator, setShowCalculator] = useState(false);

    const current = fareData[activeRoute];
    const c = current.color;

    return (
        <>
            <Head title="Routes & Fare Guide" />

            <div className="min-h-screen bg-gray-50">

                {/* Navbar */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <a href="/" className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center text-white text-lg">⚓</a>
                            <span className="font-bold text-gray-900 text-base">IslandShip</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {auth?.user ? (
                                <Link href={route("dashboard")} className="px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route("login")} className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        Log in
                                    </Link>
                                    <Link href={route("register")} className="px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <div className="bg-gradient-to-br from-green-900 via-green-700 to-teal-600 px-4 pt-8 pb-16 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">⚓ Island Shipping Corporation</p>
                        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                            Routes & Fare Guide
                        </h1>
                        <p className="text-white/70 text-sm">View fares and calculate your trip cost</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
                            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 -mt-6 pb-20">

                    {/* Route Tabs — scrollable on mobile */}
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                        {Object.entries(fareData).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => { setActiveRoute(key); setShowCalculator(false); }}
                                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                                    activeRoute === key
                                        ? `${val.color.active} text-white shadow-sm`
                                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                <span>{val.icon}</span>
                                <span>{val.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Route Info Card */}
                    <div className={`${c.bg} border ${c.border} rounded-2xl p-4 mb-5`}>
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-11 h-11 rounded-xl ${c.active} flex items-center justify-center text-xl flex-shrink-0`}>
                                {current.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold ${c.text} uppercase tracking-widest mb-0.5`}>Route</p>
                                <p className="text-sm font-bold text-gray-800 leading-snug">{current.route}</p>
                                <p className={`text-xs ${c.text} font-medium mt-1`}>⏱ {current.duration}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCalculator(!showCalculator)}
                            className={`w-full py-3 ${c.active} text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                        >
                            🧮 {showCalculator ? "Hide Calculator" : "Open Fare Calculator"}
                        </button>
                    </div>

                    {/* Calculator */}
                    {showCalculator && <FareCalculator data={current} />}

                    {/* Fare Guide */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p className={`text-xs font-bold uppercase tracking-wide ${c.text} mb-5`}>
                            📋 Fare Guide — {current.label}
                        </p>
                        <FareSection title="Passenger Fares"  emoji="👤" rows={current.passengers}   color={c} />
                        <FareSection title="Rolling Cargoes"  emoji="🚗" rows={current.vehicles}     color={c} />
                        <FareSection title="Motorcycles"      emoji="🏍️" rows={current.motorcycles}  color={c} />
                        <FareSection title="Heavy Equipment"  emoji="🏗️" rows={current.heavy}        color={c} />
                        <p className="text-xs text-gray-400 text-center mt-4 pt-4 border-t border-gray-100">
                            ⚠️ Fares are subject to change without prior notice. Senior Citizens and PWDs are entitled to 20% discount with valid ID.
                        </p>
                    </div>

                    {/* Bottom Nav Links */}
                    <div className="flex gap-3 mt-5">
                        <a href="/schedule" className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 transition-colors">
                            📅 View Schedules
                        </a>
                        <a href="/" className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 transition-colors">
                            🏠 Back to Home
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}