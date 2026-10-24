import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import carRoutes from './routes/carRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import validateEnv from './config/validateEnv.js';

dotenv.config();
validateEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : '';
const allowedOrigins = [
  clientUrl,
  'https://www.vistatours.in',
  'https://vistatours.in',
  'https://vista-tour-travel.vercel.app',
  'https://vista-tour-travels.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev access
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Rate Limiter for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
const sendHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vista Tour and Travels API is running smoothly',
    timestamp: new Date().toISOString()
  });
};
app.get('/api/health', sendHealth);
app.get('/health', sendHealth);

// Sitemap and robots endpoints
app.get(['/sitemap.xml', '/api/sitemap.xml'], (req, res) => {
  const sitemapPath = path.resolve(__dirname, '../client/public/sitemap.xml');
  res.sendFile(sitemapPath);
});

app.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
  const robotsPath = path.resolve(__dirname, '../client/public/robots.txt');
  res.sendFile(robotsPath);
});

app.get(['/llm.txt', '/api/llm.txt'], (req, res) => {
  const llmPath = path.resolve(__dirname, '../client/public/llm.txt');
  res.type('text/markdown').sendFile(llmPath);
});

// Mount API routes with /api and root fallback alias so requests work either way
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/destinations`, destinationRoutes);
  app.use(`${prefix}/packages`, packageRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/blogs`, blogRoutes);
  app.use(`${prefix}/gallery`, galleryRoutes);
  app.use(`${prefix}/testimonials`, testimonialRoutes);
  app.use(`${prefix}/inquiries`, inquiryRoutes);
  app.use(`${prefix}/faqs`, faqRoutes);
  app.use(`${prefix}/services`, serviceRoutes);
  app.use(`${prefix}/cars`, carRoutes);
  app.use(`${prefix}/fleet`, carRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/pages`, pageRoutes);
};

mountRoutes('/api');
mountRoutes('');

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Vista Tour and Travels server running on port ${PORT}`);
  });
}

export default app;
