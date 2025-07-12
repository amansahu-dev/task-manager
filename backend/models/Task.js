import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  completed: { type: Boolean, default: false },
  dueDate: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: String,
  tags: [String],
  assignedTo: { type: String }, // store email directly
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
