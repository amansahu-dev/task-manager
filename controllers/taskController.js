import Task from '../models/Task.js';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

// @desc Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, isDeleted: false });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc Get tasks assigned to the logged-in user with creator info
export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id, isDeleted: false })
      .populate('user', 'name email avatar'); // populate task creator details

    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc Create new task for logged-in user
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
      user: req.user.id, // link task to logged-in user
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(400).json({ error: 'Bad Request' });
  }
};

// @desc Update task
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

// @desc Soft delete task
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

// @desc Get deleted tasks (Recycle Bin)
export const getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, isDeleted: true });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};