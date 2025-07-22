import UserSettings from '../models/UserSettings.js';

// Get user settings (by user ID from auth middleware)
export const getUserSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });
    if (!settings) {
      // Create default settings if not found
      settings = await UserSettings.create({ user: req.user.id });
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user settings' });
  }
};

// Update user settings (by user ID from auth middleware)
export const updateUserSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id, ...req.body });
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user settings' });
  }
}; 