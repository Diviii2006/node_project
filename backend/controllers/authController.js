import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Admin/Any User Login Controller
export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Prepare user payload
    const userData = {
      id: user._id,
      userId: user.userId,
      name: user.name,
      role: user.role,
    };

    // Dynamically include fields if they exist
    if (user.program) userData.program = user.program;
    if (user.year) userData.year = user.year;
    if (user.group) userData.group = user.group;
    if (user.section) userData.section = user.section;

    res.status(200).json({
      user: userData,
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
