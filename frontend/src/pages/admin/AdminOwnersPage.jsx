import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api.js';
import { CheckCircle, XCircle, Clock, Phone, Mail, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    adminAPI.getPendingOwners().then(({ data }) => { setOwners(data.data); setLoading(false); });
  }, []);

  const handleApproval = async (id, action) => {
    setActionId(id + action);
    try {
      await adminAPI.updateOwnerApproval(id, action);
      setOwners((prev) => prev.filter((o) => o._id !== id));
      toast.success(`Owner ${action}d successfully`);
    } catch { toast.error('Action failed'); }
    finally { setActionId(null); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Clock className="w-6 h-6 text-yellow-500" /> Pending Owner Approvals
      </h1>
      <p className="text-gray-500 mb-6">{owners.length} owner{owners.length !== 1 ? 's' : ''} waiting for approval</p>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-gray-100" />)}</div>
      ) : owners.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-gray-500">All caught up!</h3>
          <p className="text-gray-400 mt-1">No pending approvals at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {owners.map((owner) => (
            <div key={owner._id} className="card p-5 border-l-4 border-l-yellow-400">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{owner.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${owner.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600">
                        <Mail className="w-3 h-3" /> {owner.email}
                      </a>
                      {owner.phone && (
                        <a href={`tel:${owner.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600">
                          <Phone className="w-3 h-3" /> {owner.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Registered: {new Date(owner.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="badge bg-yellow-100 text-yellow-700">Pending</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApproval(owner._id, 'approve')}
                  disabled={actionId === owner._id + 'approve'}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  {actionId === owner._id + 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleApproval(owner._id, 'reject')}
                  disabled={actionId === owner._id + 'reject'}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                >
                  <XCircle className="w-4 h-4" />
                  {actionId === owner._id + 'reject' ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
