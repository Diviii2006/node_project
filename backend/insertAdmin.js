/*import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    userId: 'admin001',
    password: hashedPassword,
    name: 'System Administrator',
    role: 'admin'
  });
  console.log('✅ Admin user created successfully');
  process.exit();
}).catch(err => {
  console.error('❌ MongoDB Error:', err.message);
  process.exit(1);
});
*/