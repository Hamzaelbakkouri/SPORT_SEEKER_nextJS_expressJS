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

// router.post('/', newAccessToken)
router.post('/register', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

export default router;