import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc  Update profile
// @route PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, college } = req.body;
    const updates = { name, phone, college };

    // If avatar file uploaded, send buffer to Cloudinary
    if (req.file) {
      updates.avatar = await uploadToCloudinary(req.file.buffer, 'messfinder/avatars');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Toggle favourite mess
// @route POST /api/users/favourites/:messId
export const toggleFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const messId = req.params.messId;
    const idx = user.favourites.findIndex((f) => f.toString() === messId);

    if (idx === -1) {
      user.favourites.push(messId);
    } else {
      user.favourites.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, data: user.favourites, isFavourite: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get favourites
// @route GET /api/users/favourites
export const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favourites',
      populate: { path: 'owner', select: 'name phone' },
    });
    res.json({ success: true, data: user.favourites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
