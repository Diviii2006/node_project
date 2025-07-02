import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  program: {
    type: String,
    enum: ['B.Tech', 'MCA', 'MBA'],
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  term: {
    type: String,
    enum: ['I', 'II'],
    required: true
  },
  group: {
    type: String,
    required: function() {
      return this.program === 'B.Tech';
    }
  },
  section: {
    type: String,
    required: function() {
      return this.program === 'MCA' || this.program === 'MBA';
    }
  },
  faculty: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 4
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

export default mongoose.model('Subject', subjectSchema);