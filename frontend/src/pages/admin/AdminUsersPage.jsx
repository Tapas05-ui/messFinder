import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api.js';
import { Users, Trash2, ToggleLeft, ToggleRight, Search, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = (role = roleFilter) => {
    setLoading(true);
    adminAPI.getUsers({ role }).then(({ data }) => { setUsers(data.data); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserStatus(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: data.data.isActive } : u));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = { student: 'bg-blue-100 text-blue-700', owner: 'bg-purple-100 text-purple-700', admin: 'bg-gray-100 text-gray-700' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-primary-600" /> Manage Users
      </h1>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search by name or email..." />
        </div>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); fetchUsers(e.target.value); }} className="input-field w-40">
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="owner">Owners</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-16 animate-pulse bg-gray-100" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-gray-500 text-xs"><Mail className="w-3 h-3" />{u.email}</div>
                    {u.phone && <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5"><Phone className="w-3 h-3" />{u.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${roleColor[u.role]}`}>{u.role}</span>
                    {u.role === 'owner' && (
                      <div className={`badge mt-1 text-xs capitalize ${u.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : u.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {u.approvalStatus}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggle(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'} className="text-gray-400 hover:text-primary-600 transition-colors">
                        {u.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button onClick={() => handleDelete(u._id)} title="Delete" className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
