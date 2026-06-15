import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'owner_registration',   // admin: new owner registered
        'owner_approved',       // owner: admin approved
        'owner_rejected',       // owner: admin rejected
        'new_booking',          // owner + admin: new booking
        'booking_confirmed',    // student: booking confirmed
        'booking_cancelled',    // student: booking cancelled
        'general',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // optional frontend route
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // booking/mess/user id
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
