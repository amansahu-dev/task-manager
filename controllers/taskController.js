import Task from '../models/Task.js';
import chalk from 'chalk';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).json({ error: 'Server Error' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(400).json({ error: 'Bad Request' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task Not Found' });
    res.status(200).json(task);
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task Not Found' });
    res.status(204).send();
  } catch (err) {
    console.error(chalk.red(err));
    res.status(404).json({ error: 'Task Not Found' });
  }
};
