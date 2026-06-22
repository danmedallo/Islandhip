import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function BookTrip() {
    return (
        <AppLayout>
            <Head title="Book a Trip — Coming Soon" />

            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* Hero */}
                <div className="bg-gradient-to-br from-green-900 via-green-700 to-teal-600 px-4 pt-10 pb-24 relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
                            backgroundSize: "20px 20px",
                        }}
                    />
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs px-4 py-2 rounded-full mb-6 tracking-wide">
                            🚧 Under Construction
                        </div>
                        <h1
                            className="text-3xl md:text-4xl font-bold text-white mb-3"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            Online Booking
                        </h1>
                        <p className="text-white/70 text-sm max-w-md mx-auto">
                            We're working hard to bring you a seamless ferry booking experience.
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
                            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-3xl mx-auto px-4 -mt-8 pb-20 w-full space-y-4">

                    {/* Coming Soon Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                        {/* Big Icon */}
                        <div className="flex flex-col items-center py-10 px-6 text-center border-b border-gray-100">
                            <div className="text-7xl mb-5">🚢</div>
                            <h2
                                className="text-2xl font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "'Georgia', serif" }}
                            >
                                Coming Soon!
                            </h2>
                            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                                Online booking for Island Shipping Corporation is currently being developed. Check back soon!
                            </p>
                        </div>

                        {/* What to Expect */}
                        <div className="px-5 py-5">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-4">
                                ✨ What to expect
                            </p>
                            <div className="space-y-3">
                                {[
                                    { icon: "🎫", title: "Easy Ticket Booking", desc: "Book your ferry ticket in just a few taps" },
                                    { icon: "💳", title: "Online Payment", desc: "Pay securely via GCash, Maya, or credit card" },
                                    { icon: "📱", title: "Mobile Tickets", desc: "Get your e-ticket directly on your phone" },
                                    { icon: "🔔", title: "Trip Reminders", desc: "Get notified before your departure" },
                                    { icon: "🚗", title: "Vehicle Booking", desc: "Book for RORO — cars, motorcycles, trucks" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Book via Phone Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-green-50 border-b border-green-100 px-5 py-3">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest">
                                📞 Book by Phone (Available Now)
                            </p>
                        </div>
                        <div className="px-5 py-4 space-y-4">
                            <p className="text-sm text-gray-500">
                                While online booking is being set up, you can contact Island Shipping directly to reserve your trip:
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="tel:+63322660718"
                                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                                        📞
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Call Us</p>
                                        <p className="text-sm font-bold text-green-700">(032) 266-0718</p>
                                        <p className="text-xs text-gray-400">(032) 340-6453 · (032) 266-0466</p>
                                    </div>
                                    <span className="ml-auto text-green-600 text-lg">→</span>
                                </a>
                                <a
                                    href="mailto:info@islandshipping.com.ph"
                                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                                        ✉️
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Email Us</p>
                                        <p className="text-sm font-bold text-blue-700">info@islandshipping.com.ph</p>
                                        <p className="text-xs text-gray-400">We'll respond within 24 hours</p>
                                    </div>
                                    <span className="ml-auto text-blue-600 text-lg">→</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <a
                            href="/schedules"
                            className="flex-1 py-3.5 bg-green-700 text-white rounded-xl text-sm font-semibold text-center hover:bg-green-800 transition-colors"
                        >
                            📅 View Schedules
                        </a>
                        <a
                            href="/fares"
                            className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
                        >
                            💰 View Fares
                        </a>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}