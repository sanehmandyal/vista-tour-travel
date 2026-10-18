import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(protect, requireAdmin, createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, requireAdmin, updateCar)
  .delete(protect, requireAdmin, deleteCar);

export default router;
