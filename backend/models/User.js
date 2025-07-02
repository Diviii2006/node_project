import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'hod', 'dean'],
    required: true
  },
  program: {
    type: String,
    enum: ['B.Tech', 'MCA', 'MBA'],
    required: function() {
      return this.role === 'student' || this.role === 'hod';
    }
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
    required: function() {
      return this.role === 'student';
    }
  },
  group: {
    type: String,
    required: function() {
      return this.role === 'student' && this.program === 'B.Tech';
    }
  },
  section: {
    type: String,
    required: function() {
      return this.role === 'student' && (this.program === 'MCA' || this.program === 'MBA');
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);