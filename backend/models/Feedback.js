import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  term: {
    type: String,
    enum: ['I', 'II'],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  ratings: {
    teachingQuality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    courseContent: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    overallSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  comments: {
    type: String,
    maxlength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one feedback per student per subject per term
feedbackSchema.index({ student: 1, subject: 1, term: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Feedback', feedbackSchema);