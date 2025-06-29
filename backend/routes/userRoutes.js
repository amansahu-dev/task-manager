import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

const storage = multer.memoryStorage(); // using memory storage for base64
const upload = multer({ storage });

router.get('/me', protect, getProfile);
router.put('/me', protect, upload.single('avatar'), updateProfile);
router.get('/', protect, getAllUsers);

export default router;
