import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { userAPI } from '../utils/api.js';
import { User, Camera, Phone, GraduationCap, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', college: user?.college || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      const { data } = await userAPI.updateProfile(fd);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="card p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
              {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-primary-400" />}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-md">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>
          <p className="font-semibold text-gray-900 mt-3">{user?.name}</p>
          <span className="badge bg-primary-100 text-primary-700 mt-1 capitalize">{user?.role}</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-10" />
            </div>
          </div>
          {user?.role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">College</label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="input-field pl-10" />
              </div>
            </div>
          )}
          <div className="pt-2">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-gray-700 font-medium">{user?.email}</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
