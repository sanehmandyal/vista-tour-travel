import express from 'express';
import {
  getUsers,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

export default router;
