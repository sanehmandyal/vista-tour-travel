import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, requireAdmin, createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, requireAdmin, updateBlog)
  .delete(protect, requireAdmin, deleteBlog);

export default router;
