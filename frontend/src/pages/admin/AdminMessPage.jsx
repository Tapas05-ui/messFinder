import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, messAPI } from '../../utils/api.js';
import { Building2, Eye, Trash2, MapPin, IndianRupee, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessPage() {
  const [messList, setMessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getAllMess().then(({ data }) => { setMessList(data.data); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mess listing?')) return;
    try {
      await messAPI.delete(id);
      setMessList((prev) => prev.filter((m) => m._id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = messList.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address?.city?.toLowerCase().includes(search.toLowerCase()) ||
    m.owner?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary-600" /> All Mess Listings
      </h1>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search by name, city, or owner..." />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((mess) => (
            <div key={mess._id} className="card p-4 flex items-center gap-4">
              <img
                src={mess.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=80&h=60&fit=crop'}
                alt={mess.name}
                className="w-16 h-12 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{mess.name}</h3>
                  <span className={`badge ${mess.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {mess.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mess.address?.city}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{mess.startingRent?.toLocaleString()}/mo</span>
                  <span>Owner: {mess.owner?.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/mess/${mess._id}`} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
                  <Eye className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(mess._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-10 text-gray-400">No listings found</div>}
        </div>
      )}
    </div>
  );
}
