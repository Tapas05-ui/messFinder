import express from 'express';
import {
  createBooking, getMyBookings, getOwnerBookings,
  updateBookingStatus, cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('student'), createBooking);
router.get('/my', authorize('student'), getMyBookings);
router.get('/owner', authorize('owner'), getOwnerBookings);
router.patch('/:id/status', authorize('owner'), updateBookingStatus);
router.patch('/:id/cancel', authorize('student'), cancelBooking);

export default router;
