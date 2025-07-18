import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chalk from 'chalk';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { initSocket } from './socket/socketInstance.js';
import { configureSocket } from './socket/socketHandler.js';

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(chalk.blue(`🚀 Server running at http://localhost:${PORT}`)));