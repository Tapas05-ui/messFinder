import { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api.js';
import { BookOpen, Phone, Mail, MapPin, IndianRupee, Calendar, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    bookingAPI.getOwnerBookings().then(({ data }) => { setBookings(data.data); setLoading(false); });
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(true);
    try {
      await bookingAPI.updateStatus(id, { status, ownerNote: note });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status, ownerNote: note } : b));
      toast.success(`Booking ${status}!`);
      setNoteModal(null);
      setNote('');
    } catch { toast.error('Action failed'); }
    finally { setActionLoading(false); }
  };

  const filterBookings = (status) => bookings.filter((b) => b.status === status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary-600" /> Booking Requests
      </h1>
      <p className="text-gray-500 mb-6">{filterBookings('pending').length} pending request{filterBookings('pending').length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-32 animate-pulse bg-gray-100" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-gray-500">No booking requests yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className={`card p-5 border-l-4 ${b.status === 'pending' ? 'border-l-yellow-400' : b.status === 'confirmed' ? 'border-l-green-400' : 'border-l-gray-200'}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary-700 text-sm">{b.student?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{b.student?.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {b.student?.phone && (
                        <a href={`tel:${b.student.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                          <Phone className="w-3 h-3" /> {b.student.phone}
                        </a>
                      )}
                      {b.student?.email && (
                        <a href={`mailto:${b.student.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                          <Mail className="w-3 h-3" /> {b.student.email}
                        </a>
                      )}
                    </div>
                    {b.student?.college && <p className="text-xs text-gray-400 mt-0.5">🎓 {b.student.college}</p>}
                  </div>
                </div>
                <span className={`badge ${statusColors[b.status]} capitalize shrink-0`}>{b.status}</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Mess</p>
                  <p className="font-medium text-gray-700">{b.mess?.name}</p>
                </div>
                {b.room?.roomNumber && (
                  <div>
                    <p className="text-xs text-gray-400">Room</p>
                    <p className="font-medium text-gray-700">Room {b.room.roomNumber} (Floor {b.room.floor})</p>
                  </div>
                )}
                {b.room?.rentPerPerson && (
                  <div>
                    <p className="text-xs text-gray-400">Rent</p>
                    <p className="font-medium text-gray-700 flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{b.room.rentPerPerson?.toLocaleString()}/mo</p>
                  </div>
                )}
                {b.moveInDate && (
                  <div>
                    <p className="text-xs text-gray-400">Move-in</p>
                    <p className="font-medium text-gray-700 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.moveInDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {b.message && (
                <div className="flex items-start gap-2 mb-3 text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
                  <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p>"{b.message}"</p>
                </div>
              )}

              {b.ownerNote && (
                <p className="text-xs text-gray-400 italic mb-3">Your note: "{b.ownerNote}"</p>
              )}

              {b.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setNoteModal({ id: b._id, action: 'confirmed' }); setNote(''); }}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm
                  </button>
                  <button
                    onClick={() => { setNoteModal({ id: b._id, action: 'cancelled' }); setNote(''); }}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-1">
              {noteModal.action === 'confirmed' ? '✅ Confirm Booking' : '❌ Decline Booking'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">Add an optional note for the student.</p>
            <textarea
              rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              className="input-field resize-none mb-4"
              placeholder={noteModal.action === 'confirmed' ? 'e.g. Please bring ID proof on move-in day...' : 'e.g. Room no longer available...'}
            />
            <div className="flex gap-3">
              <button onClick={() => setNoteModal(null)} className="flex-1 btn-outline">Cancel</button>
              <button
                onClick={() => handleAction(noteModal.id, noteModal.action)}
                disabled={actionLoading}
                className={`flex-1 font-semibold px-5 py-2.5 rounded-xl text-white transition-colors disabled:opacity-60 ${noteModal.action === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {actionLoading ? 'Processing...' : noteModal.action === 'confirmed' ? 'Confirm' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
