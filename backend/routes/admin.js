/*import express from 'express';
import {
  createUser,
  addSubject,
  getAllUsers,
  editUser,
  deleteUser,
  searchUsers,
  getAllSubjects,
  editSubject,
  deleteSubject,
  assignHOD,
  assignDean,
  sendAnnouncement,
  getAnnouncements,
  setFeedbackAccess,
  getFeedbackAccess,
  getStats
} from '../controllers/adminController.js';

import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-user', verifyToken, verifyAdmin, createUser);
router.post('/add-subject', verifyToken, verifyAdmin, addSubject);

router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/users/search', verifyToken, verifyAdmin, searchUsers);
router.put('/users/:id', verifyToken, verifyAdmin, editUser);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

router.get('/subjects', verifyToken, verifyAdmin, getAllSubjects);
router.put('/subjects/:id', verifyToken, verifyAdmin, editSubject);
router.delete('/subjects/:id', verifyToken, verifyAdmin, deleteSubject);

router.post('/assign-hod', verifyToken, verifyAdmin, assignHOD);
router.post('/assign-dean', verifyToken, verifyAdmin, assignDean);

router.post('/announcement', verifyToken, verifyAdmin, sendAnnouncement);
router.get('/announcements', verifyToken, verifyAdmin, getAnnouncements);

router.post('/feedback-lock', verifyToken, verifyAdmin, setFeedbackAccess);
router.get('/feedback-lock', verifyToken, verifyAdmin, getFeedbackAccess);

router.get('/stats', verifyToken, verifyAdmin, getStats);

export default router;*/
