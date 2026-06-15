import { useState, useEffect } from 'react';
import { messAPI } from '../utils/api.js';
import MessCard from '../components/mess/MessCard.jsx';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function MessListPage() {
  const [messList, setMessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', gender: '', college: '', page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchMess = async (f = filters) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const { data } = await messAPI.getAll(params);
      setMessList(data.data);
      setPagination(data.pagination);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchMess(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchMess({ ...filters, page: 1 }); };
  const setF = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  const clearFilters = () => { const f = { city: '', minRent: '', maxRent: '', gender: '', college: '', page: 1 }; setFilters(f); fetchMess(f); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Find a Mess</h1>
        <p className="text-gray-500">Browse mess listings near your college</p>
      </div>

      {/* Search + Filter bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={filters.city} onChange={setF('city')}
              className="input-field pl-10" placeholder="Search by city..."
            />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button type="submit" className="btn-primary">Search</button>
        </div>

        {showFilters && (
          <div className="card p-4 mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <input type="text" value={filters.college} onChange={setF('college')} className="input-field text-sm" placeholder="College name" />
            <select value={filters.gender} onChange={setF('gender')} className="input-field text-sm">
              <option value="">Any Gender</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
            <input type="number" value={filters.minRent} onChange={setF('minRent')} className="input-field text-sm" placeholder="Min rent (₹)" />
            <input type="number" value={filters.maxRent} onChange={setF('maxRent')} className="input-field text-sm" placeholder="Max rent (₹)" />
            <button type="button" onClick={clearFilters} className="col-span-2 md:col-span-4 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" /> Clear all filters
            </button>
          </div>
        )}
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : messList.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏠</p>
          <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">No mess found</h3>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{pagination.total} mess listing{pagination.total !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {messList.map((mess) => <MessCard key={mess._id} mess={mess} />)}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { const f = { ...filters, page: i + 1 }; setFilters(f); fetchMess(f); }}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${filters.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
