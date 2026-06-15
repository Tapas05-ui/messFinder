import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { messAPI } from '../../utils/api.js';
import { PlusCircle, Edit3, Trash2, Eye, ToggleLeft, ToggleRight, MapPin, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    messAPI.getMyListings().then(({ data }) => { setListings(data.data); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await messAPI.delete(id);
      setListings((prev) => prev.filter((m) => m._id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await messAPI.toggleAvailability(id);
      setListings((prev) => prev.map((m) => m._id === id ? { ...m, isAvailable: data.data.isAvailable } : m));
      toast.success('Availability updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">My Listings</h1>
        <Link to="/owner/add-mess" className="btn-primary flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Add Mess</Link>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-gray-100" />)}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏠</p>
          <h3 className="font-display text-xl font-semibold text-gray-500 mb-2">No listings yet</h3>
          <Link to="/owner/add-mess" className="btn-primary mt-2 inline-block">Add Your First Mess</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((mess) => (
            <div key={mess._id} className="card p-5 flex gap-4">
              <img
                src={mess.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&h=90&fit=crop'}
                alt={mess.name}
                className="w-24 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{mess.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {mess.address?.area}, {mess.address?.city}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary-600 font-semibold mt-1">
                      <IndianRupee className="w-3.5 h-3.5" />{mess.startingRent?.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge ${mess.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {mess.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link to={`/mess/${mess._id}`} className="btn-ghost text-xs flex items-center gap-1 py-1.5 px-3">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link to={`/owner/edit-mess/${mess._id}`} className="btn-ghost text-xs flex items-center gap-1 py-1.5 px-3">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => handleToggle(mess._id)} className="btn-ghost text-xs flex items-center gap-1 py-1.5 px-3">
                    {mess.isAvailable ? <ToggleRight className="w-3.5 h-3.5 text-green-500" /> : <ToggleLeft className="w-3.5 h-3.5 text-gray-400" />}
                    {mess.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button onClick={() => handleDelete(mess._id)} className="btn-ghost text-xs flex items-center gap-1 py-1.5 px-3 text-red-500 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
