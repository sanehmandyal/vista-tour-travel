import express from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, requireAdmin, createService);

router.route('/:id')
  .put(protect, requireAdmin, updateService)
  .delete(protect, requireAdmin, deleteService);

export default router;
