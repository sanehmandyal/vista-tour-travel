import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reliable server uploads directory
const uploadDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine with sanitized, collision-resistant filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const rawExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `img-${uniqueSuffix}${rawExt}`);
  }
});

// Strict file filter: Validates BOTH extension AND MIME type
const fileFilter = (req, file, cb) => {
  const allowedExts = /\.(jpe?g|png|webp|avif|gif)$/i;
  const allowedMimeTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif'
  ];

  const extValid = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedMimeTypes.includes(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only verified image files (JPG, PNG, WebP, AVIF, GIF) are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 files per request
  },
  fileFilter: fileFilter
});
