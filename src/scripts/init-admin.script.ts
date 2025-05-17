import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const initAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/everfit';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    console.log('Admin user created successfully:', {
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    });

  } catch (error) {
    console.error('Error initializing admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
initAdmin(); 