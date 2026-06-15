import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MessListPage from './pages/MessListPage.jsx';
import MessDetailPage from './pages/MessDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FavouritesPage from './pages/student/FavouritesPage.jsx';
import MyBookingsPage from './pages/student/MyBookingsPage.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import AddMessPage from './pages/owner/AddMessPage.jsx';
import EditMessPage from './pages/owner/EditMessPage.jsx';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage.jsx';
import MyListingsPage from './pages/owner/MyListingsPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminOwnersPage from './pages/admin/AdminOwnersPage.jsx';
import AdminMessPage from './pages/admin/AdminMessPage.jsx';
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/mess" element={<MessListPage />} />
          <Route path="/mess/:id" element={<MessDetailPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/favourites" element={<ProtectedRoute roles={['student']}><FavouritesPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute roles={['student']}><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/add-mess" element={<ProtectedRoute roles={['owner']}><AddMessPage /></ProtectedRoute>} />
          <Route path="/owner/edit-mess/:id" element={<ProtectedRoute roles={['owner']}><EditMessPage /></ProtectedRoute>} />
          <Route path="/owner/bookings" element={<ProtectedRoute roles={['owner']}><OwnerBookingsPage /></ProtectedRoute>} />
          <Route path="/owner/listings" element={<ProtectedRoute roles={['owner']}><MyListingsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/owners" element={<ProtectedRoute roles={['admin']}><AdminOwnersPage /></ProtectedRoute>} />
          <Route path="/admin/mess" element={<ProtectedRoute roles={['admin']}><AdminMessPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
