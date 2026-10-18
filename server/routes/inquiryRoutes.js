import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createInquiry)
  .get(protect, requireAdmin, getInquiries);

router.route('/:id')
  .put(protect, requireAdmin, updateInquiry)
  .delete(protect, requireAdmin, deleteInquiry);

export default router;
