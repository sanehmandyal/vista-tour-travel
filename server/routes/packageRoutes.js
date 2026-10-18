import express from 'express';
import {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/packageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPackages)
  .post(protect, requireAdmin, createPackage);

router.route('/:slug')
  .get(getPackageBySlug);

router.route('/:id')
  .put(protect, requireAdmin, updatePackage)
  .delete(protect, requireAdmin, deletePackage);

export default router;
