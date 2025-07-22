import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  notifications: {
    dailyReminders: { type: Boolean, default: true },
    general: { type: Boolean, default: true },
    // Add more preferences as needed
  },
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public' },
    showEmail: { type: Boolean, default: false },
    showActivity: { type: Boolean, default: true },
    allowTaskAssignment: { type: Boolean, default: true },
  },
  // Add more settings fields as needed
}, { timestamps: true });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings; 