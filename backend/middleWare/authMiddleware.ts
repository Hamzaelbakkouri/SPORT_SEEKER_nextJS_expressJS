import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler'
import User from "../models/userModel";

const protect = asyncHandler(async (req: any, res: any, next) => {
    let token: string;

    token = req.cookies.jwt;
    if (token) {
        try {
            // @ts-ignore
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

export { protect };