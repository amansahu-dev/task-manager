import Notification from '../models/Notification.js';
import chalk from 'chalk';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};