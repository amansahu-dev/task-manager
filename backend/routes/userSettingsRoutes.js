import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserSettings, updateUserSettings } from '../controllers/userSettingsController.js';

const router = express.Router();

router.get('/', protect, getUserSettings);
router.put('/', protect, updateUserSettings);

export default router; 