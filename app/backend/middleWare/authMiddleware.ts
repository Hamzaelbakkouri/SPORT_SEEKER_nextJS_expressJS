import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler'
import User from "../models/userModel";
import { newAccessToken } from "../controllers/userController";

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

const protectAdmin = asyncHandler(async (req: any, res: any, next) => {
    let token: string;

    token = req.cookies.jwt;
    if (token) {
        try {
            // @ts-ignore
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.roles == 'admin') {
                req.user = await User.findById(decoded.userId).select('-password');
                next();
            } else {
                return res.status(401).json({ error: true, message: "not autoriazed for user" })
            }
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }
})

export { protect, protectAdmin };