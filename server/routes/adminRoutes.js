import express from 'express';
import {
  getDashboardStats,
  getSettings,
  updateSettings,
  uploadImage,
  seedHimachalCatalog
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

const router = express.Router();

// Seed Himachal Catalog (Destinations, Packages, Fleet)
router.post('/seed-himachal', protect, requireAdmin, seedHimachalCatalog);

// Dashboard KPIs & Analytics
router.get('/dashboard', protect, requireAdmin, getDashboardStats);
router.get('/statistics', protect, requireAdmin, getDashboardStats);

// Settings
router.get('/settings', getSettings); // Public access to view company details
router.put('/settings', protect, requireAdmin, updateSettings);

// Image Upload
router.post('/upload', protect, requireAdmin, upload.single('image'), uploadImage);

// Newsletter
router.post('/newsletter', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    await NewsletterSubscriber.create({ email: email.toLowerCase() });
    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our travel newsletter!'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/newsletter', protect, requireAdmin, async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    next(error);
  }
});

export default router;
