import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification.js';
import { sendNotification } from '../socket/socketHandler.js';
import { io } from '../socket/socketInstance.js';
import { sendUserDailyReminder } from './notificationController.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Send welcome system notification
    const notification = await Notification.create({
      user: newUser._id,
      type: 'system',
      priority: 'low',
      title: 'Welcome to TaskManager!',
      message: `Hi ${name}, thank you for joining TaskManager! Start by creating your first task.`
    });
    sendNotification(io, newUser._id, notification);

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token: generateToken(newUser)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Send daily reminder if needed
    await sendUserDailyReminder(user._id);
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },  // Just the user ID is enough if you fetch full user in middleware
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};