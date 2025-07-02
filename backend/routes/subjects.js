import express from 'express';
import Subject from '../models/Subject.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all subjects
router.get('/', auth, async (req, res) => {
  try {
    const { program, year, term, group, section } = req.query;
    let filter = { isActive: true };
    
    if (program) filter.program = program;
    if (year) filter.year = parseInt(year);
    if (term) filter.term = term;
    if (group) filter.group = group;
    if (section) filter.section = section;

    const subjects = await Subject.find(filter).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subject (Admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Create subject error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subject (Admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subject (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findByIdAndUpdate(id, { isActive: false }, { new: true });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json({ message: 'Subject deactivated successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;