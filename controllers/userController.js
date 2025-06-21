import User from '../models/User.js';
import chalk from 'chalk';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      bio: req.body.bio,
    };

    if (req.file) {
      const base64String = req.file.buffer.toString('base64');
      updates.avatar = base64String;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(400).json({ message: 'Profile update failed' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ message: 'Unable to fetch users' });
  }
};
