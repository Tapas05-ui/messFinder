import { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api.js';
import MessCard from '../../components/mess/MessCard.jsx';
import { Heart } from 'lucide-react';

export default function FavouritesPage() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getFavourites().then(({ data }) => { setFavs(data.data); setLoading(false); });
  }, []);

  const handleToggle = (messId, isFav) => {
    if (!isFav) setFavs((prev) => prev.filter((m) => m._id !== messId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" /> My Favourites
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
        </div>
      ) : favs.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-gray-500">No favourites yet</h3>
          <p className="text-gray-400 mt-1">Browse mess listings and save your favourites</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favs.map((mess) => <MessCard key={mess._id} mess={mess} onFavouriteToggle={handleToggle} />)}
        </div>
      )}
    </div>
  );
}
