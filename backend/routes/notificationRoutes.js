import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead,
  deleteNotification,
  sendDailyReminders,
  clearAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/mark-read', protect, markAllAsRead); // mark all as read
router.put('/:id/read', protect, markNotificationAsRead); // mark one as read
router.delete('/clear-all', protect, clearAllNotifications); // clear all notifications
router.delete('/:id', protect, deleteNotification); // delete one
router.post('/send-reminders', sendDailyReminders); // for demo/testing, not protected

export default router;