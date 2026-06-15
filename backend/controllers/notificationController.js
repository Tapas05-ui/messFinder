import Notification from '../models/Notification.js';

// @desc  Get my notifications
// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Mark notification(s) as read
// @route PATCH /api/notifications/read
export const markAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // array of ids or 'all'
    if (ids === 'all') {
      await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
    } else {
      await Notification.updateMany(
        { _id: { $in: ids }, recipient: req.user._id },
        { isRead: true }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
