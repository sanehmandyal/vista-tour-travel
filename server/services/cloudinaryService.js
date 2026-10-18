import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

export const handleImageUpload = async (file, folder = 'vista_travels') => {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'image'
      });
      // Delete temporary local file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (err) {
      console.error('[Cloudinary Upload Error]', err);
      // Fallback to base64 data URI if Cloudinary fails
      try {
        const mime = file.mimetype || 'image/jpeg';
        const buffer = fs.readFileSync(file.path);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return `data:${mime};base64,${buffer.toString('base64')}`;
      } catch (e) {
        return `/uploads/${file.filename}`;
      }
    }
  }

  // If Cloudinary is not configured, generate a permanent base64 data URI
  // so the image displays everywhere (Vercel & Render) and never 404s
  try {
    const mime = file.mimetype || 'image/jpeg';
    const buffer = fs.readFileSync(file.path);
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('[Base64 Upload Error]', err);
    return `/uploads/${file.filename}`;
  }
};
