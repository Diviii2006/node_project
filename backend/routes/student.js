/*import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getSubjectsForStudent,
  getHODForStudent,
  submitFeedback,
  getDeanForStudent,
  getPastFeedbacks,
  getFeedbackDeadline,
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/subjects', verifyToken, getSubjectsForStudent);
router.get('/get-hod', verifyToken, getHODForStudent);
router.get('/get-dean', verifyToken, getDeanForStudent);
router.get('/past-feedbacks', verifyToken, getPastFeedbacks);
router.get('/feedback-deadline', verifyToken, getFeedbackDeadline);
router.post('/submit-feedback', verifyToken, submitFeedback);

// ❌ Removed this line (belongs in HOD routes, not student):
// router.get('/feedbacks', verifyToken, getFeedbackForHOD);

export default router;*/
