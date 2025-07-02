import express from 'express';
import Feedback from '../models/Feedback.js';
import Subject from '../models/Subject.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Submit feedback (Students only)
router.post('/', auth, authorize('student'), async (req, res) => {
  try {
    const feedbackData = {
      ...req.body,
      student: req.user.userId
    };
    
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Feedback already submitted for this subject' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback for a student
router.get('/my-feedback', auth, authorize('student'), async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.user.userId })
      .populate('subject', 'name code faculty')
      .sort({ submittedAt: -1 });
    
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback analytics (HOD/Dean/Admin)
router.get('/analytics', auth, authorize('admin', 'hod', 'dean'), async (req, res) => {
  try {
    const { program, year, term, group, section } = req.query;
    
    let matchConditions = {};
    if (program) matchConditions.program = program;
    if (year) matchConditions.year = parseInt(year);
    if (term) matchConditions.term = term;
    if (group) matchConditions.group = group;
    if (section) matchConditions.section = section;

    const analytics = await Feedback.aggregate([
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject',
          foreignField: '_id',
          as: 'subjectInfo'
        }
      },
      {
        $unwind: '$subjectInfo'
      },
      {
        $match: matchConditions
      },
      {
        $group: {
          _id: '$subject',
          subjectName: { $first: '$subjectInfo.name' },
          faculty: { $first: '$subjectInfo.faculty' },
          avgTeachingQuality: { $avg: '$ratings.teachingQuality' },
          avgCourseContent: { $avg: '$ratings.courseContent' },
          avgCommunication: { $avg: '$ratings.communication' },
          avgPunctuality: { $avg: '$ratings.punctuality' },
          avgOverallSatisfaction: { $avg: '$ratings.overallSatisfaction' },
          totalFeedbacks: { $sum: 1 }
        }
      },
      {
        $sort: { avgOverallSatisfaction: -1 }
      }
    ]);
    
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;