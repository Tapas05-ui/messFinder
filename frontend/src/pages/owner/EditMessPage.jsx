import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { messAPI } from '../../utils/api.js';
import toast from 'react-hot-toast';
import { Trash2, Plus, Upload, X } from 'lucide-react';

const facilityList = ['wifi','electricity','water','laundry','parking','security','kitchen','ac','tv','cleaning'];

export default function EditMessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPhotos, setNewPhotos] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    messAPI.getById(id).then(({ data }) => { setMess(data.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!mess) return null;

  const setF = (k) => (e) => setMess({ ...mess, [k]: e.target.value });
  const setA = (k) => (e) => setMess({ ...mess, address: { ...mess.address, [k]: e.target.value } });

  const handleNewPhotos = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos((p) => [...p, ...files]);
    setNewPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveExisting = async (url) => {
    try {
      await messAPI.removePhoto(id, url);
      setMess((m) => ({ ...m, photos: m.photos.filter((p) => p !== url) }));
      toast.success('Photo removed');
    } catch { toast.error('Failed to remove photo'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      ['name','description','nearbyCollege','genderAllowed','rulesAndPolicies'].forEach((k) => fd.append(k, mess[k] || ''));
      fd.append('address', JSON.stringify(mess.address));
      fd.append('facilities', JSON.stringify(mess.facilities));
      fd.append('billsIncluded', JSON.stringify(mess.billsIncluded));
      fd.append('rooms', JSON.stringify(mess.rooms));
      newPhotos.forEach((p) => fd.append('photos', p));
      await messAPI.update(id, fd);
      toast.success('Listing updated!');
      navigate('/owner/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const updateRoom = (i, k, v) => setMess((m) => ({ ...m, rooms: m.rooms.map((r, idx) => idx === i ? { ...r, [k]: v } : r) }));
  const addRoom = () => setMess((m) => ({ ...m, rooms: [...m.rooms, { roomNumber: '', floor: '', capacity: 1, rentPerPerson: '', isAvailable: true, description: '' }] }));
  const removeRoom = (i) => setMess((m) => ({ ...m, rooms: m.rooms.filter((_, idx) => idx !== i) }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Edit Mess Listing</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Basic Information</h2>
          <input type="text" required value={mess.name} onChange={setF('name')} className="input-field" placeholder="Mess Name" />
          <textarea required rows={3} value={mess.description} onChange={setF('description')} className="input-field resize-none" placeholder="Description" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={mess.nearbyCollege || ''} onChange={setF('nearbyCollege')} className="input-field" placeholder="Nearby College" />
            <select value={mess.genderAllowed} onChange={setF('genderAllowed')} className="input-field">
              <option value="any">Any Gender</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
          </div>
        </div>

        {/* Photos */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Photos</h2>
          <div className="grid grid-cols-3 gap-3">
            {mess.photos?.map((url) => (
              <div key={url} className="relative aspect-video">
                <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                <button type="button" onClick={() => handleRemoveExisting(url)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">✕</button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative aspect-video">
                <img src={src} alt="" className="w-full h-full object-cover rounded-xl opacity-70" />
                <span className="absolute top-1 left-1 text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded">New</span>
              </div>
            ))}
            <label className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Add</span>
              <input type="file" accept="image/*" multiple onChange={handleNewPhotos} className="hidden" />
            </label>
          </div>
        </div>

        {/* Facilities */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {facilityList.map((f) => (
              <label key={f} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer capitalize transition-all ${mess.facilities?.[f] ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                <input type="checkbox" checked={!!mess.facilities?.[f]} onChange={(e) => setMess((m) => ({ ...m, facilities: { ...m.facilities, [f]: e.target.checked } }))} className="accent-primary-600" />
                <span className="text-sm">{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rooms */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Rooms</h2>
            <button type="button" onClick={addRoom} className="btn-outline text-sm py-1.5 px-3 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Room</button>
          </div>
          <div className="space-y-4">
            {mess.rooms?.map((room, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between mb-3">
                  <p className="font-medium text-sm">Room {i + 1}</p>
                  {mess.rooms.length > 1 && <button type="button" onClick={() => removeRoom(i)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" required value={room.roomNumber} onChange={(e) => updateRoom(i, 'roomNumber', e.target.value)} className="input-field text-sm py-2" placeholder="Room Number" />
                  <input type="text" required value={room.floor} onChange={(e) => updateRoom(i, 'floor', e.target.value)} className="input-field text-sm py-2" placeholder="Floor" />
                  <input type="number" required min="1" value={room.capacity} onChange={(e) => updateRoom(i, 'capacity', Number(e.target.value))} className="input-field text-sm py-2" placeholder="Capacity" />
                  <input type="number" required min="0" value={room.rentPerPerson} onChange={(e) => updateRoom(i, 'rentPerPerson', Number(e.target.value))} className="input-field text-sm py-2" placeholder="Rent/person (₹)" />
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id={`avail-${i}`} checked={room.isAvailable} onChange={(e) => updateRoom(i, 'isAvailable', e.target.checked)} className="accent-primary-600" />
                    <label htmlFor={`avail-${i}`} className="text-sm text-gray-600">Room is available</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-base disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
