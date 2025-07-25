import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  title: { type: String },
  type: { type: String, enum: ['system', 'task', 'reminder', 'update'], default: 'system' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;