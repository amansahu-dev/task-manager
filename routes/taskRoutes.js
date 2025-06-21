import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAssignedTasks,
  getDeletedTasks
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTasks);
router.get('/assigned', protect, getAssignedTasks);
router.get('/deleted', protect, getDeletedTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;