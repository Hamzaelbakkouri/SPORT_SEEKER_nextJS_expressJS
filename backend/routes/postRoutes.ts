import express from "express";
import {
    createPost, deletePost, getAllUserPosts, getOnePost, updatePost
} from "../controllers/postController";
import { protect } from "../middleWare/authMiddleware";
import { protectPost } from "../middleWare/PostMiddleware";

const router = express.Router()

router.post('/create', protect, createPost)
router.get('/getPost/:id', protect, getOnePost)
router.get('/AllUserPosts', protect, getAllUserPosts)
router.delete('/delete/:id', protect, protectPost, deletePost)
router.put('/update/:id', protect, protectPost, updatePost)

export default router