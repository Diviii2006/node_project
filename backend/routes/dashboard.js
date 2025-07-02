import express from 'express';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Feedback from '../models/Feedback.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard stats
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalFaculty = await User.countDocuments({ role: { $in: ['hod', 'dean'] }, isActive: true });
    const totalSubjects = await Subject.countDocuments({ isActive: true });
    const totalFeedbacks = await Feedback.countDocuments();
    
    const programStats = await User.aggregate([
      { $match: { role: 'student', isActive: true } },
      { $group: { _id: '$program', count: { $sum: 1 } } }
    ]);
    
    const feedbackTrends = await Feedback.aggregate([
      {
        $group: {
          _id: { term: '$term', year: '$year' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.term': 1 } }
    ]);
    
    res.json({
      totalUsers,
      totalStudents,
      totalFaculty,
      totalSubjects,
      totalFeedbacks,
      programStats,
      feedbackTrends
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student dashboard stats
router.get('/student', auth, authorize('student'), async (req, res) => {
  try {
    const studentId = req.user.userId;
    const student = await User.findById(studentId);
    
    const subjects = await Subject.find({
      program: student.program,
      year: student.year,
      ...(student.group && { group: student.group }),
      ...(student.section && { section: student.section }),
      isActive: true
    });
    
    const submittedFeedbacks = await Feedback.find({ student: studentId });
    
    const feedbackStatus = subjects.map(subject => {
      const feedback = submittedFeedbacks.find(f => f.subject.toString() === subject._id.toString());
      return {
        subject,
        submitted: !!feedback,
        submittedAt: feedback?.submittedAt
      };
    });
    
    res.json({
      student,
      subjects,
      feedbackStatus,
      totalSubjects: subjects.length,
      submittedCount: submittedFeedbacks.length,
      pendingCount: subjects.length - submittedFeedbacks.length
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;