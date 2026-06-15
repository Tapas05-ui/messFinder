import User from '../models/User.js';
import Mess from '../models/Mess.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { io, connectedUsers } from '../server.js';

// @desc  Get dashboard stats
// @route GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [students, owners, pendingOwners, totalMess, totalBookings] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'owner', approvalStatus: 'approved' }),
      User.countDocuments({ role: 'owner', approvalStatus: 'pending' }),
      Mess.countDocuments({ isActive: true }),
      Booking.countDocuments(),
    ]);
    res.json({ success: true, data: { students, owners, pendingOwners, totalMess, totalBookings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all pending owners
// @route GET /api/admin/owners/pending
export const getPendingOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner', approvalStatus: 'pending' }).select('-password');
    res.json({ success: true, data: owners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Approve or reject owner
// @route PATCH /api/admin/owners/:id/approval
export const updateOwnerApproval = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' | 'reject'
    const owner = await User.findById(req.params.id);
    if (!owner || owner.role !== 'owner') {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
    owner.isApproved = action === 'approve';
    owner.isRejected = action === 'reject';
    await owner.save();

    const notif = await Notification.create({
      recipient: owner._id,
      sender: req.user._id,
      type: action === 'approve' ? 'owner_approved' : 'owner_rejected',
      title: action === 'approve' ? 'Registration Approved! 🎉' : 'Registration Rejected',
      message:
        action === 'approve'
          ? 'Your mess owner account has been approved. You can now log in and list your mess!'
          : 'Unfortunately, your registration was not approved. Please contact support.',
      link: '/',
    });

    const socketId = connectedUsers.get(owner._id.toString());
    if (socketId) io.to(socketId).emit('notification', notif);

    res.json({ success: true, message: `Owner ${action}d successfully`, data: owner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all users
// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : { role: { $ne: 'admin' } };
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ success: true, data: users, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Toggle user active status
// @route PATCH /api/admin/users/:id/toggle
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: { isActive: user.isActive } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete user
// @route DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all mess (admin view)
// @route GET /api/admin/mess
export const getAllMessAdmin = async (req, res) => {
  try {
    const messList = await Mess.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: messList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all bookings (admin view)
// @route GET /api/admin/bookings
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student', 'name email')
      .populate('mess', 'name address')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
