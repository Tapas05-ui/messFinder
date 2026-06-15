import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { messAPI } from '../../utils/api.js';
import { Upload, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const facilityList = ['wifi','electricity','water','laundry','parking','security','kitchen','ac','tv','cleaning'];

const emptyRoom = () => ({ roomNumber: '', floor: '', capacity: 1, rentPerPerson: '', isAvailable: true, description: '' });

export default function AddMessPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [rooms, setRooms] = useState([emptyRoom()]);
  const [facilities, setFacilities] = useState({});
  const [billsIncluded, setBillsIncluded] = useState({ electricity: false, water: false });
  const [form, setForm] = useState({
    name: '', description: '', nearbyCollege: '', genderAllowed: 'any', rulesAndPolicies: '',
    address: { street: '', area: '', city: '', state: '', pincode: '' },
  });

  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setA = (k) => (e) => setForm({ ...form, address: { ...form.address, [k]: e.target.value } });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateRoom = (i, k, v) => setRooms((prev) => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const addRoom = () => setRooms((prev) => [...prev, emptyRoom()]);
  const removeRoom = (i) => setRooms((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) { toast.error('Please add at least one photo'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('nearbyCollege', form.nearbyCollege);
      fd.append('genderAllowed', form.genderAllowed);
      fd.append('rulesAndPolicies', form.rulesAndPolicies);
      fd.append('address', JSON.stringify(form.address));
      fd.append('facilities', JSON.stringify(facilities));
      fd.append('billsIncluded', JSON.stringify(billsIncluded));
      fd.append('rooms', JSON.stringify(rooms));
      photos.forEach((p) => fd.append('photos', p));
      await messAPI.create(fd);
      toast.success('Mess listed successfully!');
      navigate('/owner/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Add New Mess Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-gray-900">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mess Name *</label>
            <input type="text" required value={form.name} onChange={setF('name')} className="input-field" placeholder="e.g. Shree Ram Boys Mess" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea required rows={3} value={form.description} onChange={setF('description')} className="input-field resize-none" placeholder="Describe your mess, amenities, atmosphere..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nearby College</label>
              <input type="text" value={form.nearbyCollege} onChange={setF('nearbyCollege')} className="input-field" placeholder="College name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender Allowed</label>
              <select value={form.genderAllowed} onChange={setF('genderAllowed')} className="input-field">
                <option value="any">Any Gender</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-gray-900">Address</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
            <input type="text" required value={form.address.street} onChange={setA('street')} className="input-field" placeholder="House no, street name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Area/Locality *</label>
              <input type="text" required value={form.address.area} onChange={setA('area')} className="input-field" placeholder="Area name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
              <input type="text" required value={form.address.city} onChange={setA('city')} className="input-field" placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
              <input type="text" required value={form.address.state} onChange={setA('state')} className="input-field" placeholder="State" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode *</label>
              <input type="text" required value={form.address.pincode} onChange={setA('pincode')} className="input-field" placeholder="Pincode" />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Photos *</h2>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-video">
                <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
              </div>
            ))}
            <label className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Add Photo</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-2">Upload up to 10 photos. First photo will be the cover.</p>
        </div>

        {/* Facilities */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {facilityList.map((f) => (
              <label key={f} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all capitalize ${facilities[f] ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="checkbox" checked={!!facilities[f]} onChange={(e) => setFacilities({ ...facilities, [f]: e.target.checked })} className="accent-primary-600" />
                <span className="text-sm font-medium">{f}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Bills Included in Rent</p>
            <div className="flex gap-4">
              {['electricity', 'water'].map((bill) => (
                <label key={bill} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer capitalize transition-all ${billsIncluded[bill] ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                  <input type="checkbox" checked={billsIncluded[bill]} onChange={(e) => setBillsIncluded({ ...billsIncluded, [bill]: e.target.checked })} className="accent-primary-600" />
                  <span className="text-sm font-medium">{bill}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-gray-900">Rooms</h2>
            <button type="button" onClick={addRoom} className="btn-outline text-sm flex items-center gap-1 py-2 px-3">
              <Plus className="w-4 h-4" /> Add Room
            </button>
          </div>
          <div className="space-y-4">
            {rooms.map((room, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-sm text-gray-700">Room {i + 1}</p>
                  {rooms.length > 1 && (
                    <button type="button" onClick={() => removeRoom(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Room Number *</label>
                    <input type="text" required value={room.roomNumber} onChange={(e) => updateRoom(i, 'roomNumber', e.target.value)} className="input-field text-sm py-2" placeholder="101" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Floor *</label>
                    <input type="text" required value={room.floor} onChange={(e) => updateRoom(i, 'floor', e.target.value)} className="input-field text-sm py-2" placeholder="Ground / 1st / 2nd" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Capacity (persons) *</label>
                    <input type="number" required min="1" value={room.capacity} onChange={(e) => updateRoom(i, 'capacity', Number(e.target.value))} className="input-field text-sm py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Rent/Person (₹) *</label>
                    <input type="number" required min="0" value={room.rentPerPerson} onChange={(e) => updateRoom(i, 'rentPerPerson', Number(e.target.value))} className="input-field text-sm py-2" placeholder="3000" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <input type="text" value={room.description} onChange={(e) => updateRoom(i, 'description', e.target.value)} className="input-field text-sm py-2" placeholder="Any notes about this room..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-gray-900 mb-3">Rules & Policies</h2>
          <textarea rows={4} value={form.rulesAndPolicies} onChange={setF('rulesAndPolicies')} className="input-field resize-none" placeholder="E.g. No smoking, No guests after 10pm, etc." />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60">
          {loading ? 'Uploading & Publishing...' : 'Publish Mess Listing'}
        </button>
      </form>
    </div>
  );
}
