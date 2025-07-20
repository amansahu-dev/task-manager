import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chalk from 'chalk';
import cron from 'node-cron';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { initSocket } from './socket/socketInstance.js';
import { configureSocket } from './socket/socketHandler.js';
import { sendDailyReminders } from './controllers/notificationController.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize socket
const io = initSocket(server);
configureSocket(io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.green('✅ MongoDB Connected')))
  .catch(err => console.error(chalk.red(err)));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Schedule daily reminders at 9am
cron.schedule('0 9 * * *', () => {
  console.log(chalk.yellow('⏰ Running daily reminder cron job (9am)'));
  // Call with dummy req/res for internal use
  sendDailyReminders(
    { body: {}, user: null },
    { status: () => ({ json: () => {} }) }
  );
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(chalk.blue(`🚀 Server running at http://localhost:${PORT}`)));