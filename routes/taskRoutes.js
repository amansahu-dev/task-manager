import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getAssignedTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getTasks); // Get tasks for the logged-in user
router.post('/', protect, createTask); // Create task for logged-in user
router.get('/assigned', protect, getAssignedTasks); // Get tasks assigned to me
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
