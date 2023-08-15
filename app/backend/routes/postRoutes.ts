import express from "express";
import {
    createPost, deletePost, getAllUserPosts, getOnePost, updatePost
} from "../controllers/postController";
import { protect } from "../middleWare/authMiddleware";
import { protectPost } from "../middleWare/PostMiddleware";
import { newAccessToken } from "../controllers/userController";

const router = express.Router()

router.post('/create', protect, newAccessToken, createPost)
router.get('/getPost/:id', protect, newAccessToken, getOnePost)
router.get('/AllUserPosts', protect, newAccessToken, getAllUserPosts)
router.delete('/delete/:id', protect, newAccessToken, protectPost, deletePost)
router.put('/update/:id', protect, newAccessToken, protectPost, updatePost)

export default router