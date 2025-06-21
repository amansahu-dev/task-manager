import Task from '../models/Task.js';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

// @desc Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc Get tasks assigned to the logged-in user with creator info
export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
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
      { _id: req.params.id, user: req.user.id }, // ensure user owns the task
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

// @desc Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) return res.status(404).json({ error: 'Task Not Found or Unauthorized' });

    res.status(204).send();
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};
