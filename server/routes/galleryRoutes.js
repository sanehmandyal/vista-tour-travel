import express from 'express';
import {
  getGallery,
  addGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, requireAdmin, addGalleryItem);

router.route('/:id')
  .delete(protect, requireAdmin, deleteGalleryItem);

export default router;
