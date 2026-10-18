import mongoose from 'mongoose';
import User from '../models/User.js';
import WebsiteSetting from '../models/WebsiteSetting.js';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sanehmandyal_db_user:KvGLMRqlhhJNroRL@cluster0.wjzihrm.mongodb.net/rinku_tour_travels';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Auto-seed default admin if not existing
    try {
      const email = (process.env.ADMIN_EMAIL || 'admin@vistatourtravels.com').trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
      const adminUser = await User.findOne({ $or: [{ email }, { email: 'admin@vistatravels.com' }, { email: 'info@vistatourtravels.com' }] });
      if (!adminUser) {
        await User.create({
          name: 'Vista Admin (Super Admin)',
          email,
          password,
          role: 'superadmin',
          isActive: true
        });
        console.log(`[MongoDB] Initialized default admin account: ${email}`);
      } else if (adminUser.name?.includes('Rinku')) {
        adminUser.name = 'Vista Admin (Super Admin)';
        await adminUser.save();
      }
    } catch (seedErr) {
      console.warn('[MongoDB] Admin auto-seed warning:', seedErr.message);
    }

    // Auto-migrate WebsiteSetting to Amb Near Bus Stand and info@vistatourtravels.com
    try {
      let settings = await WebsiteSetting.findOne();
      if (!settings) {
        await WebsiteSetting.create({});
      } else {
        let changed = false;
        if (!settings.email || settings.email.includes('rinku') || settings.email === 'info@vistatourtravels.com') {
          settings.email = 'info@vistatourtravels.com';
          changed = true;
        }
        if (!settings.address || settings.address.includes('Kangra') || settings.address.includes('Amb') || settings.address.includes('Una')) {
          settings.address = 'Sector 73, Mohali, Punjab 160055, India';
          changed = true;
        }
        if (!settings.areasServed || settings.areasServed.includes('Amb') || settings.areasServed.startsWith('Kangra')) {
          settings.areasServed = 'Mohali (Sector 73/119), Chandigarh Tricity, Airport Transfers, Kangra, Dharamshala, McLeodGanj, Bir Billing, Dalhousie, Manali, Shimla, Chandigarh & All Himachal';
          changed = true;
        }
        if (!settings.serviceName || settings.serviceName.includes('Kangra') || settings.serviceName.includes('Rinku') || settings.serviceName.includes('Ravi')) {
          settings.serviceName = 'Vista Tour and Travels';
          changed = true;
        }
        if (!settings.googleMapsUrl || settings.googleMapsUrl.includes('Kangra') || settings.googleMapsUrl.includes('Amb')) {
          settings.googleMapsUrl = 'https://www.google.com/maps?cid=2473238779693105097';
          changed = true;
        }
        if (!settings.googleReviewsUrl || settings.googleReviewsUrl.includes('Kangra') || settings.googleReviewsUrl.includes('Amb')) {
          settings.googleReviewsUrl = 'https://www.google.com/maps?cid=2473238779693105097';
          changed = true;
        }
        if (settings.facebook && (settings.facebook.includes('rinku') || settings.facebook.includes('ravi'))) {
          settings.facebook = 'https://facebook.com/vistatourtravels';
          changed = true;
        }
        if (settings.instagram && (settings.instagram.includes('rinku') || settings.instagram.includes('ravi'))) {
          settings.instagram = 'https://instagram.com/vistatourtravels';
          changed = true;
        }
        if (settings.youtube && (settings.youtube.includes('rinku') || settings.youtube.includes('ravi'))) {
          settings.youtube = 'https://youtube.com/@vistatourtravels';
          changed = true;
        }
        if (changed) {
          await settings.save();
          console.log('[MongoDB] WebsiteSetting migrated with updated Vista Tour and Travels Mohali details.');
        }
      }
    } catch (settingErr) {
      console.warn('[MongoDB] WebsiteSetting migration warning:', settingErr.message);
    }
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn('[MongoDB] Note: To connect to MongoDB Atlas, ensure your current IP address is whitelisted in Atlas (Network Access -> Add IP -> Allow Access from Anywhere 0.0.0.0/0).');
    console.warn('[MongoDB] Server will remain running on port ' + (process.env.PORT || 5000) + ' to handle requests.');
  }
};

export default connectDB;
