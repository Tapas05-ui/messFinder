import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api.js';
import { Users, Building2, BookOpen, Clock, TrendingUp, ChevronRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getPendingOwners()])
      .then(([s, p]) => { setStats(s.data.data); setPendingOwners(p.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', val: stats.students, icon: Users, color: 'bg-blue-50 text-blue-600', link: '/admin/users?role=student' },
    { label: 'Approved Owners', val: stats.owners, icon: Building2, color: 'bg-primary-50 text-primary-600', link: '/admin/users?role=owner' },
    { label: 'Pending Approval', val: stats.pendingOwners, icon: Clock, color: 'bg-yellow-50 text-yellow-600', link: '/admin/owners' },
    { label: 'Total Mess', val: stats.totalMess, icon: Building2, color: 'bg-purple-50 text-purple-600', link: '/admin/mess' },
    { label: 'Total Bookings', val: stats.totalBookings, icon: BookOpen, color: 'bg-green-50 text-green-600', link: '/admin/bookings' },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">MessFinder control panel</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-gray-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statCards.map(({ label, val, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card p-5 hover:border-primary-200 transition-colors group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-display font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Admin quick nav */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { to: '/admin/owners', label: 'Pending Owner Approvals', desc: `${pendingOwners.length} owner${pendingOwners.length !== 1 ? 's' : ''} awaiting approval`, icon: Clock, urgent: pendingOwners.length > 0 },
          { to: '/admin/users', label: 'Manage Users', desc: 'View, activate, deactivate, or delete users', icon: Users, urgent: false },
          { to: '/admin/mess', label: 'All Mess Listings', desc: 'Monitor and manage all mess listings', icon: Building2, urgent: false },
          { to: '/admin/bookings', label: 'All Bookings', desc: 'View all booking activity', icon: BookOpen, urgent: false },
        ].map(({ to, label, desc, icon: Icon, urgent }) => (
          <Link key={to} to={to} className={`card p-5 flex items-center gap-4 hover:shadow-md transition-all group ${urgent ? 'border-yellow-200 bg-yellow-50/50' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${urgent ? 'bg-yellow-100' : 'bg-gray-100'} group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${urgent ? 'text-yellow-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {label}
                {urgent && <span className="badge bg-yellow-200 text-yellow-700">{pendingOwners.length} pending</span>}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Pending owners preview */}
      {pendingOwners.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-gray-900">Pending Owner Approvals</h2>
            <Link to="/admin/owners" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {pendingOwners.slice(0, 5).map((owner) => (
              <div key={owner._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900">{owner.name}</p>
                  <p className="text-xs text-gray-400">{owner.email} • {owner.phone}</p>
                </div>
                <Link to="/admin/owners" className="text-xs text-primary-600 hover:underline font-medium">Review →</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
