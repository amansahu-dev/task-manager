import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, getAllUsers, exportUserData, deleteUser, importUserData } from '../controllers/userController.js';

const router = express.Router();

const storage = multer.memoryStorage(); // using memory storage for base64
const upload = multer({ storage });

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/', protect, getAllUsers);
router.get('/export', protect, exportUserData);
router.delete('/delete', protect, deleteUser);
router.post('/import', protect, upload.single('file'), importUserData);

export default router;
