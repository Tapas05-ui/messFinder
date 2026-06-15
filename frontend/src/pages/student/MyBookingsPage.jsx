import { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api.js';
import { BookOpen, MapPin, IndianRupee, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMyBookings().then(({ data }) => { setBookings(data.data); setLoading(false); });
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary-600" /> My Bookings
      </h1>
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-gray-100" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-gray-500">No bookings yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card p-5 flex gap-4">
              <img src={b.mess?.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=100&h=100&fit=crop'} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.mess?.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {b.mess?.address?.city}
                    </div>
                  </div>
                  <span className={`badge ${statusColors[b.status]} shrink-0 capitalize`}>{b.status}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  {b.room?.roomNumber && <span>Room {b.room.roomNumber}</span>}
                  {b.room?.rentPerPerson && <span className="flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{b.room.rentPerPerson?.toLocaleString()}/mo</span>}
                  {b.moveInDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.moveInDate).toLocaleDateString()}</span>}
                </div>
                {b.ownerNote && <p className="text-xs text-gray-500 mt-2 italic">Owner note: "{b.ownerNote}"</p>}
                {b.status === 'pending' && (
                  <button onClick={() => handleCancel(b._id)} className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1">
                    <X className="w-3 h-3" /> Cancel booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
