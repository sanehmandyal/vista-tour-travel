import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(createTestimonial);

router.route('/:id')
  .put(protect, requireAdmin, updateTestimonial)
  .delete(protect, requireAdmin, deleteTestimonial);

export default router;
