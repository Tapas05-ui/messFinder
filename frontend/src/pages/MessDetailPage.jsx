import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messAPI, bookingAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  MapPin, Star, Wifi, Zap, Droplets, Phone, Mail, User,
  Bed, Home, Shield, ChevronLeft, ChevronRight, Heart,
  Tv, Wind, Car, Trash2, CheckCircle, XCircle, IndianRupee, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const facilityIcons = {
  wifi: { icon: Wifi, label: 'WiFi', color: 'text-blue-500 bg-blue-50' },
  electricity: { icon: Zap, label: 'Electricity', color: 'text-yellow-500 bg-yellow-50' },
  water: { icon: Droplets, label: 'Water', color: 'text-cyan-500 bg-cyan-50' },
  laundry: { icon: Trash2, label: 'Laundry', color: 'text-purple-500 bg-purple-50' },
  parking: { icon: Car, label: 'Parking', color: 'text-gray-500 bg-gray-50' },
  security: { icon: Shield, label: 'Security', color: 'text-green-500 bg-green-50' },
  kitchen: { icon: Home, label: 'Kitchen', color: 'text-orange-500 bg-orange-50' },
  ac: { icon: Wind, label: 'AC', color: 'text-sky-500 bg-sky-50' },
  tv: { icon: Tv, label: 'TV', color: 'text-rose-500 bg-rose-50' },
  cleaning: { icon: CheckCircle, label: 'Cleaning', color: 'text-teal-500 bg-teal-50' },
};

export default function MessDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({ moveInDate: '', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    messAPI.getById(id).then(({ data }) => { setMess(data.data); setLoading(false); }).catch(() => navigate('/mess'));
  }, [id]);

  const handleBook = async () => {
    if (!user) { toast.error('Please login to book'); return; }
    if (!isStudent) { toast.error('Only students can book'); return; }
    if (!selectedRoom) { toast.error('Please select a room'); return; }
    setBookingLoading(true);
    try {
      await bookingAPI.create({ messId: mess._id, roomId: selectedRoom._id, ...bookingForm });
      toast.success('Booking request sent! 🎉 The owner will contact you.');
      setShowBookingModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setBookingLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!mess) return null;

  const photos = mess.photos?.length ? mess.photos : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=500&fit=crop'];
  const activeFacilities = Object.entries(mess.facilities || {}).filter(([, v]) => v);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Photo gallery */}
      <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 mb-8 bg-gray-200 group">
        <img src={photos[imgIdx]} alt={mess.name} className="w-full h-full object-cover" />
        {photos.length > 1 && (
          <>
            <button onClick={() => setImgIdx((imgIdx - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setImgIdx((imgIdx + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
        <div className={`absolute top-4 left-4 badge ${mess.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {mess.isAvailable ? '✓ Available' : '✗ Not Available'}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{mess.name}</h1>
              {mess.averageRating > 0 && (
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-5 h-5 fill-amber-500" /> {mess.averageRating.toFixed(1)}
                  <span className="text-gray-400 text-sm font-normal">({mess.totalRatings})</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{mess.address?.street}, {mess.address?.area}, {mess.address?.city}, {mess.address?.state} - {mess.address?.pincode}</span>
            </div>
            {mess.nearbyCollege && <p className="text-primary-600 text-sm font-medium">📍 Near: {mess.nearbyCollege}</p>}
          </div>

          <div className="card p-5">
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-3">About this Mess</h2>
            <p className="text-gray-600 leading-relaxed">{mess.description}</p>
          </div>

          {/* Bills */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Bills & Charges</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Electricity Bill', mess.billsIncluded?.electricity],
                ['Water Bill', mess.billsIncluded?.water],
              ].map(([label, included]) => (
                <div key={label} className={`flex items-center gap-2 p-3 rounded-xl ${included ? 'bg-green-50' : 'bg-red-50'}`}>
                  {included ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className={`text-xs ${included ? 'text-green-600' : 'text-red-500'}`}>{included ? 'Included' : 'Extra charge'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          {activeFacilities.length > 0 && (
            <div className="card p-5">
              <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Facilities</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {activeFacilities.map(([key]) => {
                  const { icon: Icon, label, color } = facilityIcons[key] || {};
                  if (!Icon) return null;
                  return (
                    <div key={key} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${color}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rooms */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Available Rooms</h2>
            {mess.rooms?.length === 0 ? (
              <p className="text-gray-400 text-sm">No rooms listed yet</p>
            ) : (
              <div className="space-y-3">
                {mess.rooms?.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => isStudent && room.isAvailable && setSelectedRoom(selectedRoom?._id === room._id ? null : room)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRoom?._id === room._id ? 'border-primary-500 bg-primary-50' :
                      !room.isAvailable ? 'border-gray-100 bg-gray-50 opacity-60' :
                      'border-gray-200 hover:border-primary-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Bed className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Room {room.roomNumber}</p>
                          <p className="text-xs text-gray-500">Floor: {room.floor} • Capacity: {room.capacity} person{room.capacity > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-primary-600 font-bold">
                          <IndianRupee className="w-3.5 h-3.5" />{room.rentPerPerson?.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-400">per person/mo</p>
                        <span className={`badge mt-1 ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {room.isAvailable ? 'Available' : 'Full'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rules */}
          {mess.rulesAndPolicies && (
            <div className="card p-5">
              <h2 className="font-display font-semibold text-lg text-gray-900 mb-3">Rules & Policies</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{mess.rulesAndPolicies}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="card p-5 sticky top-20">
            <div className="flex items-center gap-1 text-3xl font-display font-bold text-primary-600 mb-1">
              <IndianRupee className="w-6 h-6" />{mess.startingRent?.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mb-4">Starting rent per person/month</p>
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium capitalize">{mess.genderAllowed === 'any' ? 'All Genders' : `${mess.genderAllowed} Only`}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Rooms</span>
                <span className="font-medium">{mess.rooms?.length || 0}</span>
              </div>
            </div>

            {isStudent && mess.isAvailable ? (
              <button
                onClick={() => { if (!selectedRoom) { toast('Please select a room first'); return; } setShowBookingModal(true); }}
                className="btn-primary w-full text-center"
              >
                {selectedRoom ? `Book Room ${selectedRoom.roomNumber}` : 'Select a Room to Book'}
              </button>
            ) : !user ? (
              <button onClick={() => navigate('/login')} className="btn-primary w-full">Login to Book</button>
            ) : null}

            {selectedRoom && (
              <div className="mt-3 p-3 bg-primary-50 rounded-xl text-xs text-primary-700">
                Selected: Room {selectedRoom.roomNumber}, Floor {selectedRoom.floor} — ₹{selectedRoom.rentPerPerson?.toLocaleString()}/mo
              </div>
            )}
          </div>

          {/* Owner info */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Owner</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{mess.owner?.name}</p>
                <p className="text-xs text-gray-400">Mess Owner</p>
              </div>
            </div>
            {mess.owner?.phone && (
              <a href={`tel:${mess.owner.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors mb-2">
                <Phone className="w-4 h-4" /> {mess.owner.phone}
              </a>
            )}
            {mess.owner?.email && (
              <a href={`mailto:${mess.owner.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                <Mail className="w-4 h-4" /> {mess.owner.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-1">Confirm Booking</h2>
            <p className="text-gray-500 text-sm mb-5">Room {selectedRoom?.roomNumber} at {mess.name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Move-in Date</label>
                <input
                  type="date" value={bookingForm.moveInDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, moveInDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message to Owner (optional)</label>
                <textarea
                  rows={3} value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Introduce yourself, mention your college..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBookingModal(false)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={handleBook} disabled={bookingLoading} className="flex-1 btn-primary disabled:opacity-60">
                {bookingLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
