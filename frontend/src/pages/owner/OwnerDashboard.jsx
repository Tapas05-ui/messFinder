import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { messAPI, bookingAPI } from '../../utils/api.js';
import { Home, BookOpen, PlusCircle, List, TrendingUp, Eye } from 'lucide-react';

export default function OwnerDashboard() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([messAPI.getMyListings(), bookingAPI.getOwnerBookings()])
      .then(([l, b]) => { setListings(l.data.data); setBookings(b.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const pending = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your mess listings and bookings</p>
        </div>
        <Link to="/owner/add-mess" className="btn-primary flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Mess
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Listings', val: listings.length, icon: Home, color: 'bg-primary-50 text-primary-600' },
          { label: 'Total Bookings', val: bookings.length, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending', val: pending, icon: TrendingUp, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Confirmed', val: confirmed, icon: Eye, color: 'bg-green-50 text-green-600' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">{val}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link to="/owner/listings" className="card p-5 flex items-center gap-4 hover:border-primary-200 transition-colors group">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <List className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">My Listings</h3>
            <p className="text-sm text-gray-400">View, edit, delete your mess listings</p>
          </div>
        </Link>
        <Link to="/owner/bookings" className="card p-5 flex items-center gap-4 hover:border-primary-200 transition-colors group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Booking Requests</h3>
            <p className="text-sm text-gray-400">{pending} pending request{pending !== 1 ? 's' : ''}</p>
          </div>
        </Link>
      </div>

      {/* Recent bookings */}
      {bookings.slice(0, 5).length > 0 && (
        <div className="card p-5">
          <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900">{b.student?.name}</p>
                  <p className="text-xs text-gray-400">{b.mess?.name} • {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge capitalize ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
