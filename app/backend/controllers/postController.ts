import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import PostModel from "../models/postModel";
import { postBodyValidation } from '../utils/ValidationSchema';



const createPost = asyncHandler(async (req: any, res: any) => {
    let oldAccessToken = req.cookies.jwt
    const decoded = jwt.verify(oldAccessToken, process.env.JWT_SECRET as string)
    

    if (decoded) {
        const { error } = postBodyValidation(req.body)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })

        // @ts-ignore
        new PostModel({ ...req.body, userId: decoded._id }).save()

        // @ts-ignore
        return res.status(200).json({ error: false, message: "post created successfully", post: { idUser: decoded._id, ...req.body } })
    } else {
        return res.status(400).json({ error: true, messsage: "token not found,try login" })
    }
})



const deletePost = asyncHandler(async (req: any, res: any) => {
    const postID = req.params.id
    const PostToDelete = await PostModel.findById(postID)
    if (PostToDelete) {
        await PostToDelete.deleteOne()
        return res.status(200).json({ error: false, message: "deleted successfully" })
    } else {
        return res.status(400).json({ error: true, message: "post Not Found" })
    }
})



const updatePost = asyncHandler(async (req: any, res: any) => {
    const postID = req.params.id
    const PostToUpdate = await PostModel.findById(postID)
    if (PostToUpdate) {
        PostToUpdate.postTitle = req.body.postTitle;
        PostToUpdate.postText = req.body.postText;
        PostToUpdate.postImage = req.body.postImage;
        await PostToUpdate.updateOne();
        return res.status(200).json({ error: false, PostToUpdate })
    } else {
        return res.status(400).json({ error: true, message: "post Not Found" })
    }
})



const getOnePost = asyncHandler(async (req: any, res: any) => {
    const PostID = req.params.id
    const fetchPost = await PostModel.findById(PostID)
    if (fetchPost) {
        return res.status(200).json({ error: false, post: fetchPost })
    }
    return res.status(404).json({ error: true, message: "Post not found" })
})



const getAllUserPosts = asyncHandler(async (req: any, res: any) => {
    const accessToken = req.cookies.jwt
    // @ts-ignore
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (decoded) {
        // @ts-ignore
        await PostModel.find({ userId: decoded._id })
            .then((Posts) => {
                if (Posts) {
                    return res.status(200).json({ error: false, Posts })
                }
                return res.status(400).json({ error: true, message: "Posts Not Found " })
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        return res.status(404).json({ error: true, message: "token Not Found " })
    }
})



export {
    createPost,
    deletePost,
    updatePost,
    getOnePost,
    getAllUserPosts
}