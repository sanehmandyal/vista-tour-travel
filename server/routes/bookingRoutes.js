import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Optional auth for booking creation
const optionalProtect = async (req, res, next) => {
  if ((req.headers.authorization && req.headers.authorization.startsWith('Bearer')) || (req.cookies && req.cookies.token)) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, createBooking)
  .get(protect, requireAdmin, getAllBookings);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, requireAdmin, deleteBooking);

router.put('/:id/status', protect, requireAdmin, updateBookingStatus);

export default router;
