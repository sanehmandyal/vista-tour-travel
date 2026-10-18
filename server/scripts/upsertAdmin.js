import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI must be set');
}

try {
  await mongoose.connect(mongoUri);

  const user = await User.findOne({ email }).select('+password');
  if (user) {
    user.password = password;
    user.role = 'superadmin';
    user.isActive = true;
    await user.save();
    console.log(`[Admin] Updated ${email}`);
  } else {
    await User.create({
      name: 'Vista Admin (Super Admin)',
      email,
      password,
      role: 'superadmin',
      isActive: true
    });
    console.log(`[Admin] Created ${email}`);
  }
} finally {
  await mongoose.disconnect();
}