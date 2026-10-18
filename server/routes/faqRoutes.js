import express from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFAQs)
  .post(protect, requireAdmin, createFAQ);

router.route('/:id')
  .put(protect, requireAdmin, updateFAQ)
  .delete(protect, requireAdmin, deleteFAQ);

export default router;
