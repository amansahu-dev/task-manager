import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: String,
  tags: [String],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // task assigned to another user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // creator of the task
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
