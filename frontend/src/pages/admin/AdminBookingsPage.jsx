import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api.js';
import { BookOpen, MapPin, IndianRupee, Calendar, Search } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getAllBookings().then(({ data }) => { setBookings(data.data); setLoading(false); });
  }, []);

  const filtered = bookings
    .filter((b) => !statusFilter || b.status === statusFilter)
    .filter((b) =>
      b.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.mess?.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary-600" /> All Bookings
      </h1>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search by student or mess..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-40">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b._id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{b.student?.name}</p>
                    <span className="text-gray-400 text-sm">→</span>
                    <p className="font-semibold text-primary-700 truncate">{b.mess?.name}</p>
                    <span className={`badge capitalize ${statusColors[b.status]}`}>{b.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{b.student?.email}</span>
                    {b.mess?.address?.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.mess.address.city}</span>}
                    {b.room?.rentPerPerson && <span className="flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{b.room.rentPerPerson.toLocaleString()}/mo</span>}
                    {b.moveInDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.moveInDate).toLocaleDateString()}</span>}
                    <span>Requested: {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-10 text-gray-400">No bookings found</div>}
        </div>
      )}
    </div>
  );
}
