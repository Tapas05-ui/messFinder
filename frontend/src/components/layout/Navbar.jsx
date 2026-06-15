import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { notificationAPI } from '../../utils/api.js';
import {
  Home, Menu, X, Bell, User, LogOut, Heart, BookOpen,
  PlusSquare, List, LayoutDashboard, Users, Building2, ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isOwner, isStudent, notifications, unreadCount, setNotifications, setUnreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    if (user) {
      notificationAPI.getAll().then(({ data }) => {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationAPI.markAsRead('all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`font-medium transition-colors duration-200 ${
        isActive(to) ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">Mess<span className="text-primary-600">Finder</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/', 'Home')}
            {navLink('/mess', 'Find Mess')}
            <a href="#services" className="font-medium text-gray-600 hover:text-primary-600 transition-colors">Services</a>
            <a href="#contact" className="font-medium text-gray-600 hover:text-primary-600 transition-colors">Contact</a>

            {/* Owner nav */}
            {isOwner && (
              <>
                {navLink('/owner/add-mess', 'Add Home')}
                {navLink('/owner/listings', 'Home List')}
                {navLink('/owner/bookings', 'Bookings')}
              </>
            )}

            {/* Student nav */}
            {isStudent && (
              <>
                {navLink('/favourites', 'Favourites')}
                {navLink('/my-bookings', 'My Bookings')}
              </>
            )}

            {/* Admin nav */}
            {isAdmin && navLink('/admin', 'Dashboard')}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-400 py-8 text-sm">No notifications</p>
                        ) : notifications.map((n) => (
                          <div key={n._id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-primary-50' : ''}`}>
                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-primary-600 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {[['/', 'Home'], ['/mess', 'Find Mess']].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">{label}</Link>
            ))}
            {isOwner && [
              ['/owner/add-mess', 'Add Home'],
              ['/owner/listings', 'Home List'],
              ['/owner/bookings', 'Bookings'],
            ].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">{label}</Link>
            ))}
            {isStudent && [
              ['/favourites', 'Favourites'],
              ['/my-bookings', 'My Bookings'],
            ].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">{label}</Link>
            ))}
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Admin Dashboard</Link>}
          </div>
        )}
      </div>
    </nav>
  );
}
