import User from '../models/User.js';
import chalk from 'chalk';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import UserSettings from '../models/UserSettings.js';

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
    const updates = {};
    if (typeof req.body.name !== 'undefined') updates.name = req.body.name;
    if (typeof req.body.bio !== 'undefined') updates.bio = req.body.bio;
    if (req.file) {
      const base64String = req.file.buffer.toString('base64');
      updates.avatar = base64String;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(400).json({ message: 'Profile update failed', error: err.message });
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

// Export all user data as JSON
export const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const tasks = await Task.find({ user: req.user.id });
    const notifications = await Notification.find({ user: req.user.id });
    const settings = await UserSettings.findOne({ user: req.user.id });
    const data = {
      user,
      tasks,
      notifications,
      settings
    };
    res.setHeader('Content-Disposition', 'attachment; filename="user_data.json"');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ message: 'Failed to export user data' });
  }
};

// Import user data from JSON
export const importUserData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const jsonString = req.file.buffer.toString('utf-8');
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON file' });
    }
    // Upsert user profile (only allow updating name, bio, avatar)
    if (data.user) {
      const allowedFields = ['name', 'bio', 'avatar'];
      const updates = {};
      for (const key of allowedFields) {
        if (typeof data.user[key] !== 'undefined') updates[key] = data.user[key];
      }
      await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    }
    // Replace tasks
    if (Array.isArray(data.tasks)) {
      await Task.deleteMany({ user: req.user.id });
      for (const t of data.tasks) {
        const { _id, user, ...taskData } = t;
        await Task.create({ ...taskData, user: req.user.id });
      }
    }
    // Replace notifications
    if (Array.isArray(data.notifications)) {
      await Notification.deleteMany({ user: req.user.id });
      for (const n of data.notifications) {
        const { _id, user, ...notifData } = n;
        await Notification.create({ ...notifData, user: req.user.id });
      }
    }
    // Replace settings
    if (data.settings) {
      await UserSettings.deleteOne({ user: req.user.id });
      await UserSettings.create({ ...data.settings.toObject ? data.settings.toObject() : data.settings, user: req.user.id });
    }
    res.status(200).json({ message: 'User data imported successfully' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ message: 'Failed to import user data' });
  }
};

// Delete user and all related data
export const deleteUser = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    await Task.deleteMany({ user: req.user.id });
    await UserSettings.deleteOne({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'User and all related data deleted' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
