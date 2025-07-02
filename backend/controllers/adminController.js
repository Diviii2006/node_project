import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Announcement from '../models/Announcement.js';
import Feedback from '../models/Feedback.js';
import FeedbackLock from '../models/FeedbackLock.js';

// ✅ Create student / hod / dean
export const createUser = async (req, res) => {
  try {
    const { userId, password, name, role, program, year, group, section } = req.body;

    if (!userId || !password || !name || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ userId });
    if (exists) {
      return res.status(400).json({ message: 'userId already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      userId,
      password: hashedPassword,
      name,
      role,
    };

    // Student logic
    if (role === 'student') {
      if (!program || year === undefined) {
        return res.status(400).json({ message: 'Program and year are required for students' });
      }

      const parsedYear = parseInt(year);
      if ((program === 'MCA' || program === 'MBA') && (parsedYear < 1 || parsedYear > 2)) {
        return res.status(400).json({ message: `${program} supports only years 1 and 2` });
      } else if (program === 'B.Tech' && (parsedYear < 1 || parsedYear > 4)) {
        return res.status(400).json({ message: 'B.Tech supports years 1 to 4' });
      }

      newUser.program = program;
      newUser.year = parsedYear;

      if (program === 'B.Tech') {
        if (!group) return res.status(400).json({ message: 'Group required for B.Tech students' });
        newUser.group = group;
      } else {
        if (!section) return res.status(400).json({ message: `Section required for ${program} students` });
        newUser.section = section;
      }
    }

    // HOD / Dean logic
    if (role === 'hod' || role === 'dean') {
      if (!program) return res.status(400).json({ message: 'Program is required for HOD/Dean' });
      newUser.program = program;

      if (program === 'B.Tech') {
        if (!group) return res.status(400).json({ message: 'Group required for B.Tech HOD/Dean' });
        newUser.group = group;
      }
      // MCA/MBA HOD/Dean: no group/section needed
    }

    const savedUser = await User.create(newUser);

    res.status(201).json({
      message: `${role} created successfully`,
      user: {
        id: savedUser._id,
        userId: savedUser.userId,
        name: savedUser.name,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Add Subject (Admin only)
export const addSubject = async (req, res) => {
  try {
    const { name, year, term, facultyName, program, group, section } = req.body;

    if (!name || year === undefined || !term || !facultyName || !program) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedYear = parseInt(year);
    if ((program === 'MCA' || program === 'MBA') && (parsedYear < 1 || parsedYear > 2)) {
      return res.status(400).json({ message: `${program} supports only years 1 and 2` });
    } else if (program === 'B.Tech' && (parsedYear < 1 || parsedYear > 4)) {
      return res.status(400).json({ message: 'B.Tech supports years 1 to 4' });
    }

    const subjectData = {
      name,
      year: parsedYear,
      term: parseInt(term),
      facultyName,
      program,
    };

    if (program === 'B.Tech') {
      if (!group) return res.status(400).json({ message: 'Group is required for B.Tech subject' });
      subjectData.group = group;
    }

    if (program === 'MCA' || program === 'MBA') {
      if (!section) return res.status(400).json({ message: `Section is required for ${program} subject` });
      subjectData.section = section;
    }

    const newSubject = new Subject(subjectData);
    await newSubject.save();

    res.status(201).json({
      message: 'Subject added successfully',
      subject: newSubject,
    });
  } catch (err) {
    console.error('Error adding subject:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- All other existing functions remain unchanged below ---

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const filter = req.query;
    const users = await User.find(filter, '-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    await User.findByIdAndUpdate(id, update);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ subjects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};

export const editSubject = async (req, res) => {
  try {
    await Subject.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Subject updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

export const assignHOD = async (req, res) => {
  try {
    const { userId, program, year, group, section } = req.body;
    const update = { program, year, role: 'hod' };
    if (group) update.group = group;
    if (section) update.section = section;
    await User.findOneAndUpdate({ userId }, update);
    res.json({ message: 'HOD assigned' });
  } catch (err) {
    res.status(500).json({ message: 'Assignment failed' });
  }
};

export const assignDean = async (req, res) => {
  try {
    const { userId, program } = req.body;
    await User.findOneAndUpdate({ userId }, { program, role: 'dean' });
    res.json({ message: 'Dean assigned' });
  } catch (err) {
    res.status(500).json({ message: 'Assignment failed' });
  }
};

export const sendAnnouncement = async (req, res) => {
  try {
    const { message, audience } = req.body;
    const newMsg = new Announcement({ message, audience });
    await newMsg.save();
    res.status(201).json({ message: 'Announcement sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send' });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch' });
  }
};

export const setFeedbackAccess = async (req, res) => {
  try {
    const { locked } = req.body;
    const access = await FeedbackLock.findOneAndUpdate({}, { locked }, { upsert: true, new: true });
    res.json({ message: `Feedback ${locked ? 'locked' : 'unlocked'}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update access' });
  }
};

export const getFeedbackAccess = async (req, res) => {
  try {
    const access = await FeedbackLock.findOne();
    res.json({ locked: access?.locked || false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get access status' });
  }
};

export const getStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: 'student' });
    const hods = await User.countDocuments({ role: 'hod' });
    const deans = await User.countDocuments({ role: 'dean' });
    const subjects = await Subject.countDocuments();
    const feedbacks = await Feedback.countDocuments();
    res.json({ students, hods, deans, subjects, feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats' });
  }
};
