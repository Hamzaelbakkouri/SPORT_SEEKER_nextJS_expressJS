import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import PostModel from '../models/postModel';

const protectPost = asyncHandler(async (req: any, res: any, next) => {
    const oldAccessToken = req.cookies.jwt
    const PostId = req.params.id
    try {
        // @ts-ignore
        const decoded = jwt.verify(oldAccessToken, process.env.JWT_SECRET)
        const  userId  = decoded._id
        const PostToCheck = await PostModel.findById(PostId)
        const iduserPost = PostToCheck?.userId.toString()
        
        if (iduserPost == userId) {
            next();
        } else {
            return res.status(401).json({ error: true, message: "Unauthorized User" })
        }
    } catch (error) {
        console.log(error);
    }
})

export { protectPost }