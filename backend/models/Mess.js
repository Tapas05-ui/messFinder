import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  floor: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  occupiedCount: { type: Number, default: 0 },
  rentPerPerson: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  description: { type: String },
});

const messSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    nearbyCollege: { type: String, trim: true },
    photos: [{ type: String }],
    rooms: [roomSchema],

    // Facilities
    facilities: {
      wifi: { type: Boolean, default: false },
      electricity: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      kitchen: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      tv: { type: Boolean, default: false },
      cleaning: { type: Boolean, default: false },
    },

    billsIncluded: {
      electricity: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
    },

    rulesAndPolicies: { type: String },
    genderAllowed: { type: String, enum: ['male', 'female', 'any'], default: 'any' },

    // Availability flag (owner manually set)
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },

    // Computed: minimum rent among rooms
    startingRent: { type: Number, default: 0 },

    ratings: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

messSchema.index({ location: '2dsphere' });

messSchema.pre('save', function (next) {
  if (this.rooms && this.rooms.length > 0) {
    const rents = this.rooms.map((r) => r.rentPerPerson);
    this.startingRent = Math.min(...rents);
  }
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  next();
});

const Mess = mongoose.model('Mess', messSchema);
export default Mess;
