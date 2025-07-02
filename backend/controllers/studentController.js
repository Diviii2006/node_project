import Subject from '../models/Subject.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import FeedbackLock from '../models/FeedbackLock.js';

// ✅ 1. Get Subjects for Logged-in Student (with feedback status)
export const getSubjectsForStudent = async (req, res) => {
  try {
    const student = req.user;
    const { year, term } = req.query;

    if (!year || !term) {
      return res.status(400).json({ message: 'Year and term are required' });
    }

    const filter = {
      program: student.program,
      year: parseInt(year),
      term: parseInt(term),
    };

    if (student.program === 'MCA' || student.program === 'MBA') {
      filter.section = student.section;
    } else if (student.program === 'B.Tech') {
      filter.group = student.group;
    }

    const subjects = await Subject.find(filter);
    const feedbacks = await Feedback.find({ studentId: student._id });
    const submittedSubjectIds = feedbacks.map(f => f.subjectId.toString());

    const subjectWithStatus = subjects.map(sub => ({
      ...sub.toObject(),
      feedbackSubmitted: submittedSubjectIds.includes(sub._id.toString()),
    }));

    res.json({ subjects: subjectWithStatus });
  } catch (err) {
    console.error('Error getting subjects:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 2. Get HOD Name for Student
export const getHODForStudent = async (req, res) => {
  try {
    const student = req.user;
    const filter = {
      role: 'hod',
      program: student.program,
    };
    if (student.program === 'B.Tech') filter.group = student.group;

    const hod = await User.findOne(filter);
    if (!hod) return res.status(404).json({ message: 'HOD not found' });

    res.json({ hodName: hod.name });
  } catch (err) {
    console.error('Error fetching HOD:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 3. Get Dean Name for Student
export const getDeanForStudent = async (req, res) => {
  try {
    const student = req.user;
    const dean = await User.findOne({ role: 'dean', program: student.program });

    if (!dean) return res.status(404).json({ message: 'Dean not found' });

    res.json({ deanName: dean.name });
  } catch (err) {
    console.error('Dean fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 4. Get Feedback Deadline (latest one)
export const getFeedbackDeadline = async (req, res) => {
  try {
    const deadline = await FeedbackLock.findOne().sort({ createdAt: -1 });
    if (!deadline) return res.json({ deadline: null });

    res.json({ deadline: deadline.date });
  } catch (err) {
    console.error('Deadline fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 5. Submit Feedback for Subject (once only)
export const submitFeedback = async (req, res) => {
  try {
    const student = req.user;
    const { subjectId, answers } = req.body;

    if (!subjectId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Incomplete feedback submission' });
    }

    const existing = await Feedback.findOne({ studentId: student._id, subjectId });
    if (existing) {
      return res.status(409).json({ message: 'Feedback already submitted for this subject' });
    }

    const feedback = new Feedback({
      studentId: student._id,
      subjectId,
      responses: answers,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ 6. Get Past Feedbacks Submitted by Student
export const getPastFeedbacks = async (req, res) => {
  try {
    const student = req.user;

    const feedbacks = await Feedback.find({ studentId: student._id }).populate('subjectId');

    res.json({ feedbacks });
  } catch (err) {
    console.error('Past feedback fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
