/**
 * Run once to create the admin user:
 *   node utils/createAdmin.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email: 'admin@messfinder.com' });
  if (existing) { console.log('Admin already exists'); process.exit(0); }
  await User.create({
    name: 'Admin',
    email: 'admin@messfinder.com',
    password: 'Admin@123',
    role: 'admin',
    approvalStatus: 'approved',
    isApproved: true,
  });
  console.log('✅ Admin created\n   Email: admin@messfinder.com\n   Password: Admin@123');
  process.exit(0);
};

createAdmin().catch((e) => { console.error(e); process.exit(1); });
