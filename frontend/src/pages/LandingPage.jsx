import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Shield,
  Star,
  ArrowRight,
  Home,
  Users,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Trusted by 1000+ students across India</span>
          </div> */}
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-amber-300">Mess Near College</span>
          </h1>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop visiting mess after mess. Compare rooms, facilities, prices,
            and book your ideal accommodation—all in one place, without leaving
            your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/mess"
              className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" /> Find a Mess
            </Link>
            <Link
              to="/register"
              className="bg-white/20 backdrop-blur border border-white/40 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-2"
            >
              List Your Mess <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["500+", "Mess Listings"],
            ["2000+", "Happy Students"],
            ["50+", "Cities"],
            ["4.8★", "Average Rating"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl md:text-3xl font-display font-bold text-primary-600">
                {val}
              </p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MessFinder Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From searching to booking, we've made the entire process simple
              and transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Search & Filter",
                desc: "Search mess listings near your college. Filter by price, facilities, gender, and more.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Home,
                title: "Compare & Choose",
                desc: "See photos, room details, bills included, and all facilities. Read reviews from other students.",
                color: "bg-primary-50 text-primary-600",
              },
              {
                icon: CheckCircle,
                title: "Book Instantly",
                desc: "Send a booking request with a message. The owner confirms, and you get notified instantly.",
                color: "bg-amber-50 text-amber-600",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 text-center">
                <div
                  className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Find the Right Mess
            </h2>
            <div className="space-y-4">
              {[
                "Detailed room info — floor, capacity, rent per person",
                "Know if water & electricity bills are included",
                "See photos before visiting physically",
                "Filter by gender-allowed policy",
                "Save favourites and compare later",
                "Real-time booking notifications",
              ].map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600">{f}</p>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className="btn-primary mt-8 inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 flex items-center justify-center min-h-64">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              {[
                ["🏠", "Rooms Listed", "500+"],
                ["👥", "Students", "2000+"],
                ["⭐", "Avg Rating", "4.8"],
                ["🏙️", "Cities", "50+"],
              ].map(([emoji, label, val]) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl p-4 text-center shadow-sm"
                >
                  <p className="text-2xl mb-1">{emoji}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-display font-bold text-primary-700">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA for owners */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Users className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-4">
            Are You a Mess Owner?
          </h2>
          <p className="text-gray-400 mb-8">
            List your mess on MessFinder and reach thousands of students looking
            for accommodation near their college.
          </p>
          <Link to="/register" className="btn-primary">
            Register as Owner
          </Link>
        </div>
      </section>
    </div>
  );
}
