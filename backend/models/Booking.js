import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mess: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
    room: {
      roomId: { type: mongoose.Schema.Types.ObjectId },
      roomNumber: String,
      floor: String,
      rentPerPerson: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    moveInDate: { type: Date },
    message: { type: String }, // student's message to owner
    ownerNote: { type: String }, // owner's response
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
