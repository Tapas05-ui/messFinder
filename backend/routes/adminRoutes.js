import express from 'express';
import {
  getStats, getPendingOwners, updateOwnerApproval,
  getAllUsers, toggleUserStatus, deleteUser,
  getAllMessAdmin, getAllBookingsAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/owners/pending', getPendingOwners);
router.patch('/owners/:id/approval', updateOwnerApproval);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/mess', getAllMessAdmin);
router.get('/bookings', getAllBookingsAdmin);

export default router;
