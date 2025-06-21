import Task from '../models/Task.js';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

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
    const tasks = await Task.find({ assignedTo: req.user.id, isDeleted: false })
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
    const { title, description, dueDate, priority, category, tags, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      category,
      tags,
      assignedTo,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(400).json({ error: 'Bad Request' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isDeleted: false },
      req.body,
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
