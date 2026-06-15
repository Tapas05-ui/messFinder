import Mess from '../models/Mess.js';
import { uploadMultipleToCloudinary, uploadToCloudinary } from '../config/cloudinary.js';
import cloudinary from '../config/cloudinary.js';

// helper to extract public_id from a cloudinary URL for deletion
const getPublicId = (url) => {
  const parts = url.split('/');
  const file = parts[parts.length - 1].split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${file}`;
};

// @desc  Create a mess
// @route POST /api/mess
export const createMess = async (req, res) => {
  try {
    const {
      name, description, address, nearbyCollege,
      facilities, billsIncluded, rulesAndPolicies,
      genderAllowed, rooms, location,
    } = req.body;

    // Upload photos to Cloudinary from memory buffers
    const photos = req.files && req.files.length > 0
      ? await uploadMultipleToCloudinary(req.files)
      : [];

    const parsedRooms = typeof rooms === 'string' ? JSON.parse(rooms) : (rooms || []);
    const parsedFacilities = typeof facilities === 'string' ? JSON.parse(facilities) : (facilities || {});
    const parsedBills = typeof billsIncluded === 'string' ? JSON.parse(billsIncluded) : (billsIncluded || {});
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : (location || { type: 'Point', coordinates: [0, 0] });

    const mess = await Mess.create({
      owner: req.user._id,
      name, description,
      address: parsedAddress,
      location: parsedLocation,
      nearbyCollege,
      photos,
      rooms: parsedRooms,
      facilities: parsedFacilities,
      billsIncluded: parsedBills,
      rulesAndPolicies,
      genderAllowed,
    });

    res.status(201).json({ success: true, data: mess });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all mess listings (public, with filters)
// @route GET /api/mess
export const getAllMess = async (req, res) => {
  try {
    const { city, minRent, maxRent, gender, college, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (gender && gender !== 'any') query.genderAllowed = { $in: [gender, 'any'] };
    if (college) query.nearbyCollege = new RegExp(college, 'i');
    if (minRent || maxRent) {
      query.startingRent = {};
      if (minRent) query.startingRent.$gte = Number(minRent);
      if (maxRent) query.startingRent.$lte = Number(maxRent);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Mess.countDocuments(query);
    const messList = await Mess.find(query)
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: messList,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single mess
// @route GET /api/mess/:id
export const getMessById = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id)
      .populate('owner', 'name phone email avatar')
      .populate('ratings.student', 'name avatar');
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    res.json({ success: true, data: mess });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get owner's own mess listings
// @route GET /api/mess/owner/my-listings
export const getMyListings = async (req, res) => {
  try {
    const messList = await Mess.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: messList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update mess
// @route PUT /api/mess/:id
export const updateMess = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    if (mess.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updates = { ...req.body };
    ['rooms', 'facilities', 'billsIncluded', 'address', 'location'].forEach((key) => {
      if (typeof updates[key] === 'string') updates[key] = JSON.parse(updates[key]);
    });

    // Upload new photos if any
    if (req.files && req.files.length > 0) {
      const newUrls = await uploadMultipleToCloudinary(req.files);
      updates.photos = [...(mess.photos || []), ...newUrls];
    }

    const updated = await Mess.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete mess
// @route DELETE /api/mess/:id
export const deleteMess = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    if (mess.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await mess.deleteOne();
    res.json({ success: true, message: 'Mess deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Toggle mess availability
// @route PATCH /api/mess/:id/availability
export const toggleAvailability = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    if (mess.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    mess.isAvailable = !mess.isAvailable;
    await mess.save();
    res.json({ success: true, data: { isAvailable: mess.isAvailable } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Remove a photo
// @route DELETE /api/mess/:id/photos
export const removePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    if (mess.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    // Delete from Cloudinary
    try {
      const publicId = getPublicId(photoUrl);
      await cloudinary.uploader.destroy(publicId);
    } catch (_) { /* ignore cloudinary deletion errors */ }

    mess.photos = mess.photos.filter((p) => p !== photoUrl);
    await mess.save();
    res.json({ success: true, data: mess });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add a review/rating
// @route POST /api/mess/:id/review
export const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });

    const alreadyReviewed = mess.ratings.find(
      (r) => r.student.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Already reviewed' });
    }

    mess.ratings.push({ student: req.user._id, rating: Number(rating), review });
    await mess.save();
    res.status(201).json({ success: true, data: mess });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
