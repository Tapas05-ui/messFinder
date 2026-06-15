import Booking from '../models/Booking.js';
import Mess from '../models/Mess.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { io, connectedUsers } from '../server.js';

const sendSocketNotif = (userId, notif) => {
  const socketId = connectedUsers.get(userId.toString());
  if (socketId) io.to(socketId).emit('notification', notif);
};

// @desc  Create booking
// @route POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { messId, roomId, moveInDate, message } = req.body;

    const mess = await Mess.findById(messId).populate('owner');
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    if (!mess.isAvailable) {
      return res.status(400).json({ success: false, message: 'This mess is currently not available' });
    }

    const room = mess.rooms.id(roomId);
    const roomInfo = room
      ? { roomId: room._id, roomNumber: room.roomNumber, floor: room.floor, rentPerPerson: room.rentPerPerson }
      : {};

    const booking = await Booking.create({
      student: req.user._id,
      mess: messId,
      room: roomInfo,
      moveInDate,
      message,
    });

    // Notify owner
    const ownerNotif = await Notification.create({
      recipient: mess.owner._id,
      sender: req.user._id,
      type: 'new_booking',
      title: 'New Booking Request',
      message: `${req.user.name} has requested to book a room in ${mess.name}.`,
      relatedId: booking._id,
      link: '/owner/bookings',
    });
    sendSocketNotif(mess.owner._id, ownerNotif);

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      const adminNotif = await Notification.create({
        recipient: admin._id,
        sender: req.user._id,
        type: 'new_booking',
        title: 'New Booking',
        message: `${req.user.name} booked a room in ${mess.name}.`,
        relatedId: booking._id,
        link: '/admin/bookings',
      });
      sendSocketNotif(admin._id, adminNotif);
    }

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get student's bookings
// @route GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('mess', 'name address photos startingRent')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get owner's received bookings
// @route GET /api/bookings/owner
export const getOwnerBookings = async (req, res) => {
  try {
    const myMesses = await Mess.find({ owner: req.user._id }).select('_id');
    const messIds = myMesses.map((m) => m._id);
    const bookings = await Booking.find({ mess: { $in: messIds } })
      .populate('student', 'name email phone avatar college')
      .populate('mess', 'name address photos')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update booking status (owner confirms/cancels)
// @route PATCH /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, ownerNote } = req.body;
    const booking = await Booking.findById(req.params.id).populate('mess');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.mess.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = status;
    if (ownerNote) booking.ownerNote = ownerNote;
    await booking.save();

    // Notify student
    const notif = await Notification.create({
      recipient: booking.student,
      sender: req.user._id,
      type: status === 'confirmed' ? 'booking_confirmed' : 'booking_cancelled',
      title: status === 'confirmed' ? 'Booking Confirmed! 🎉' : 'Booking Update',
      message:
        status === 'confirmed'
          ? `Your booking at ${booking.mess.name} has been confirmed!`
          : `Your booking at ${booking.mess.name} has been ${status}.`,
      relatedId: booking._id,
      link: '/student/bookings',
    });
    sendSocketNotif(booking.student, notif);

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Cancel booking (student cancels)
// @route PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
