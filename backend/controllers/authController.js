import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { io, connectedUsers } from '../server.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @desc  Register user
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, college } = req.body;

    if (!['student', 'owner'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      college,
      approvalStatus: role === 'owner' ? 'pending' : 'approved',
      isApproved: role === 'student',
    });

    // Notify all admins if owner registered
    if (role === 'owner') {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const notif = await Notification.create({
          recipient: admin._id,
          sender: user._id,
          type: 'owner_registration',
          title: 'New Mess Owner Registration',
          message: `${name} has registered as a mess owner and is awaiting approval.`,
          relatedId: user._id,
          link: '/admin/owners',
        });

        const adminSocketId = connectedUsers.get(admin._id.toString());
        if (adminSocketId) {
          io.to(adminSocketId).emit('notification', notif);
        }
      }
    }

    res.status(201).json({
      success: true,
      message:
        role === 'owner'
          ? 'Registration successful! Awaiting admin approval.'
          : 'Registration successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        token: role === 'student' ? generateToken(user._id) : undefined,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
    }

    if (user.role === 'owner' && user.approvalStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message:
          user.approvalStatus === 'rejected'
            ? 'Your registration was rejected by the admin'
            : 'Your account is pending admin approval',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        approvalStatus: user.approvalStatus,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('favourites');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
