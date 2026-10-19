import express from 'express';
import {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
} from '../controllers/pageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPages)
  .post(protect, requireAdmin, createPage);

router.route('/:slug')
  .get(getPageBySlug)
  .put(protect, requireAdmin, updatePage)
  .delete(protect, requireAdmin, deletePage);

export default router;
