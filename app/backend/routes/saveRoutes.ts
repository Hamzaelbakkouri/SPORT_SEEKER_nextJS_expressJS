import express from 'express'
import { protect } from "../middleWare/authMiddleware";
import { newAccessToken } from '../controllers/userController';
import { createSave } from '../controllers/saveController';

const router = express.Router()

router.post('/create/:id', protect, newAccessToken, createSave)
router.get('/getusersaves/:id', protect, newAccessToken, )
router.delete('/deletsave/:id', protect, newAccessToken, )
router.get('getsaveusers/:id' , protect , newAccessToken ,)

export default router