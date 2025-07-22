import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAssignedTasks,
  getDeletedTasks,
  restoreTask,
  permanentlyDeleteTask,
  getFilteredTasks,
  updateTaskStatus,
  restoreAllDeletedTasks,
  permanentlyDeleteAllDeletedTasks
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTasks);
router.get('/filter', protect, getFilteredTasks);
router.get('/assigned', protect, getAssignedTasks);
router.get('/deleted', protect, getDeletedTasks);
router.put('/restore/:id', protect, restoreTask);
router.put('/restore-all', protect, restoreAllDeletedTasks);
router.delete('/permanent/:id', protect, permanentlyDeleteTask);
router.delete('/permanent-all', protect, permanentlyDeleteAllDeletedTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.put('/:id/status', protect, updateTaskStatus);

export default router;