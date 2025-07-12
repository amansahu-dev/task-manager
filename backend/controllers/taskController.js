import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import chalk from 'chalk';
import { sendNotification } from '../socket/socketHandler.js';
import { io } from '../socket/socketInstance.js';

export const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user.id, isDeleted: false };
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

export const getFilteredTasks = async (req, res) => {
  try {
    const filter = { user: req.user.id, isDeleted: false };

    if (req.query.dueDate) {
      filter.dueDate = { $lte: new Date(req.query.dueDate) };
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.email, isDeleted: false })
      .populate('user', 'name email avatar');

    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

export const getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, isDeleted: true });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task Not Found or Unauthorized' });

    res.status(200).json({ message: 'Task restored successfully', task });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};

export const permanentlyDeleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id, isDeleted: true });

    if (!task) return res.status(404).json({ error: 'Task Not Found or Unauthorized' });

    res.status(200).json({ message: 'Task permanently deleted' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, tags, assignedTo, status } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      category,
      tags,
      status,
      assignedTo: assignedTo || null, // email string
      user: req.user.id,
    });

    if (assignedTo && assignedTo !== req.user.email) {
      const assignedToUser = await User.findOne({ email: assignedTo });
      if (assignedToUser) {
        await Notification.create({
          user: assignedToUser._id,
          message: `You have been assigned a new task: "${title}"`
        });
        sendNotification(io, assignedToUser._id, `You have a new task: "${title}"`);
      }
    }

    res.status(201).json(task);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(400).json({ error: 'Bad Request' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task Not Found or Unauthorized' });

    res.status(200).json(task);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task Not Found or Unauthorized' });

    res.status(200).json({ message: 'Task moved to Recycle Bin' });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isDeleted: false },
      { status: req.body.status },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task Not Found or Unauthorized' });

    res.status(200).json({ message: 'Task status updated', task });
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};