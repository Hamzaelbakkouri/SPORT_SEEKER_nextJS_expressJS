import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    getUserProfile,
    newAccessToken
} from '../controllers/userController';
import { protect } from '../middleWare/authMiddleware';

const router = express.Router();

router.post('/register', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.route('/profile').get(protect, newAccessToken, getUserProfile).put(protect, newAccessToken, updateUserProfile)

export default router;