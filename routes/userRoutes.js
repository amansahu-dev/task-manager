import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Multer config for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/me', protect, getProfile);
router.put('/me', protect, upload.single('avatar'), updateProfile);
router.get('/', protect, getAllUsers);

export default router;
