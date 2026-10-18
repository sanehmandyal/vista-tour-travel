import express from 'express';
import {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination
} from '../controllers/destinationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDestinations)
  .post(protect, requireAdmin, createDestination);

router.route('/:slug')
  .get(getDestinationBySlug);

router.route('/:id')
  .put(protect, requireAdmin, updateDestination)
  .delete(protect, requireAdmin, deleteDestination);

export default router;
