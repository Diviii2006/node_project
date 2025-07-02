/*import express from 'express';
import {
  getSubjectsForStudent,
  getHODForStudent,
  getDeanForStudent,
  submitFeedback,
  getFeedbackStatus,
  getPastFeedbacks,
  getFeedbackDeadline,
} from '../controllers/studentController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🎓 Get subjects for student (filtered by year/term/group/section)
router.get('/subjects', verifyToken, getSubjectsForStudent);

// 👨‍🏫 Get assigned HOD
router.get('/get-hod', verifyToken, getHODForStudent);

// 🏛 Get assigned Dean (based on program)
router.get('/get-dean', verifyToken, getDeanForStudent);

// ✅ Submit feedback (only once per subject)
router.post('/submit-feedback', verifyToken, submitFeedback);

// 🟢 Get feedback status (which subjects submitted)
router.get('/feedback-status', verifyToken, getFeedbackStatus);

// 📂 Get past feedbacks (optional)
router.get('/past-feedbacks', verifyToken, getPastFeedbacks);

// 🔐 Get feedback deadline
router.get('/feedback-deadline', verifyToken, getFeedbackDeadline);

export default router;*/
