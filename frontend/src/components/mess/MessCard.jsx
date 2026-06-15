import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Zap, Droplets, Heart, Users, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userAPI } from '../../utils/api.js';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MessCard({ mess, onFavouriteToggle }) {
  const { user, isStudent } = useAuth();
  const [isFav, setIsFav] = useState(
    user?.favourites?.some((f) => (f._id || f) === mess._id)
  );
  const [favLoading, setFavLoading] = useState(false);

  const handleFav = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save favourites'); return; }
    if (!isStudent) return;
    setFavLoading(true);
    try {
      const { data } = await userAPI.toggleFavourite(mess._id);
      setIsFav(data.isFavourite);
      if (onFavouriteToggle) onFavouriteToggle(mess._id, data.isFavourite);
    } catch { toast.error('Failed to update favourite'); }
    finally { setFavLoading(false); }
  };

  const photo = mess.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={photo}
          alt={mess.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Availability badge */}
        <div className={`absolute top-3 left-3 badge ${mess.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mess.isAvailable ? 'Available' : 'Not Available'}
        </div>
        {/* Gender badge */}
        <div className="absolute top-3 right-3 badge bg-white/90 text-gray-700 capitalize">
          {mess.genderAllowed === 'any' ? 'All Gender' : `${mess.genderAllowed} Only`}
        </div>
        {/* Favourite button */}
        {isStudent && (
          <button
            onClick={handleFav}
            disabled={favLoading}
            className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-semibold text-gray-900 text-base leading-tight line-clamp-1">{mess.name}</h3>
          {mess.averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold ml-2 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              {mess.averageRating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{mess.address?.area}, {mess.address?.city}</span>
        </div>

        {mess.nearbyCollege && (
          <p className="text-xs text-primary-600 font-medium mb-3">Near: {mess.nearbyCollege}</p>
        )}

        {/* Facilities */}
        <div className="flex items-center gap-2 mb-4">
          {mess.facilities?.wifi && <span title="WiFi" className="p-1.5 bg-blue-50 rounded-lg"><Wifi className="w-3.5 h-3.5 text-blue-500" /></span>}
          {mess.billsIncluded?.electricity && <span title="Electricity Included" className="p-1.5 bg-yellow-50 rounded-lg"><Zap className="w-3.5 h-3.5 text-yellow-500" /></span>}
          {mess.billsIncluded?.water && <span title="Water Included" className="p-1.5 bg-cyan-50 rounded-lg"><Droplets className="w-3.5 h-3.5 text-cyan-500" /></span>}
          {mess.rooms?.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
              <Users className="w-3.5 h-3.5" /> {mess.rooms.length} room{mess.rooms.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-0.5 text-primary-600 font-bold text-lg">
              <IndianRupee className="w-4 h-4" />
              {mess.startingRent?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">per person/month</p>
          </div>
          <Link to={`/mess/${mess._id}`} className="btn-primary text-xs px-4 py-2">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
