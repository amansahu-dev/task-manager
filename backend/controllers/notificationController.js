import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import UserSettings from '../models/UserSettings.js';
import chalk from 'chalk';
import { sendNotification } from '../socket/socketHandler.js';
import { io } from '../socket/socketInstance.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// Clear all notifications for the user
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// Send daily reminders for due/overdue tasks
export const sendDailyReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find all tasks due today or overdue and not completed
    const tasks = await Task.find({
      dueDate: { $lt: tomorrow },
      status: { $ne: 'completed' },
      isDeleted: false
    }).populate('user', 'name email');

    // Group tasks by user
    const userTasks = {};
    tasks.forEach(task => {
      const uid = task.user._id.toString();
      if (!userTasks[uid]) userTasks[uid] = [];
      userTasks[uid].push(task);
    });

    // Send a reminder notification to each user
    for (const [userId, tasks] of Object.entries(userTasks)) {
      // Check userSettings for dailyReminders
      const settings = await UserSettings.findOne({ user: userId });
      if (settings && settings.notifications && settings.notifications.dailyReminders === false) continue;
      const message = `You have ${tasks.length} task(s) due today or overdue. Please check your tasks.`;
      const notification = await Notification.create({
        user: userId,
        type: 'reminder',
        priority: 'high',
        title: 'Task Due Reminder',
        message
      });
      sendNotification(io, userId, notification);
    }

    res.status(200).json({ message: 'Reminders sent', count: Object.keys(userTasks).length });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Failed to send reminders' });
  }
};

// Helper: Send daily reminder for a single user (used on login)
export const sendUserDailyReminder = async (userId) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Find all tasks due today or overdue and not completed for this user
  const tasks = await Task.find({
    user: userId,
    dueDate: { $lt: tomorrow },
    status: { $ne: 'completed' },
    isDeleted: false
  });
  // Check userSettings for dailyReminders
  const settings = await UserSettings.findOne({ user: userId });
  if (settings && settings.notifications && settings.notifications.dailyReminders === false) return;
  if (tasks.length > 0) {
    const message = `You have ${tasks.length} task(s) due today or overdue. Please check your tasks.`;
    const notification = await Notification.create({
      user: userId,
      type: 'reminder',
      priority: 'high',
      title: 'Task Due Reminder',
      message
    });
    sendNotification(io, userId, notification);
  }
};