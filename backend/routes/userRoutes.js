import express from 'express';
import { updateProfile, toggleFavourite, getFavourites } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);

router.put('/profile', upload.single('avatar'), updateProfile);
router.get('/favourites', authorize('student'), getFavourites);
router.post('/favourites/:messId', authorize('student'), toggleFavourite);

export default router;
