import express from 'express';
import {
  createMess, getAllMess, getMessById, getMyListings,
  updateMess, deleteMess, toggleAvailability, removePhoto, addReview,
} from '../controllers/messController.js';
import { protect, authorize, ownerApproved } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getAllMess);
router.get('/:id', getMessById);

router.use(protect);

router.post('/', authorize('owner'), ownerApproved, upload.array('photos', 10), createMess);
router.get('/owner/my-listings', authorize('owner'), ownerApproved, getMyListings);
router.put('/:id', authorize('owner', 'admin'), upload.array('photos', 10), updateMess);
router.delete('/:id', authorize('owner', 'admin'), deleteMess);
router.patch('/:id/availability', authorize('owner'), ownerApproved, toggleAvailability);
router.delete('/:id/photos', authorize('owner'), ownerApproved, removePhoto);
router.post('/:id/review', authorize('student'), addReview);

export default router;
