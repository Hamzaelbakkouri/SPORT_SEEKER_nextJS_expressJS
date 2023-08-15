import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken'
import User from '../models/userModel'
import { logInBodyValidation, refreshTokenBodyValidation, signUpBodyValidation } from '../utils/ValidationSchema'
import verifyRefreshToken from '../utils/verifyRefreshToken';
import UserToken from '../models/userTokenModel';



// login User
const authUser = asyncHandler(async (req: any, res: any) => {

    try {
        const { error } = logInBodyValidation(req.body)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })

        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(401).json({ error: true, message: "Invalid email or password" })
        // @ts-ignore
        const verfiedPassword = bcrypt.compare(req.body.password, user.password)
        if (!verfiedPassword)
            return res.status(401).json({ error: true, message: "Invalid email or password" })

        const { accessToken, refreshToken } = await generateToken(user)
        await res.cookie('jwt', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 1000
        })
        await res.status(200).json({
            message: "Logged success",
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" })

    }
})


// register User
const registerUser = asyncHandler(async (req: any, res: any) => {
    try {
        const { error } = signUpBodyValidation(req.body)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).json({ error: true, message: "User Already Exist" })

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({ ...req.body, password: hashPassword }).save()

        res.status(201).json({
            error: false,
            messsage: "User created sucessfully",
            name: req.body.name,
            email: req.body.email,
            roles: req.body.roles
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})


// get profile User
const getUserProfile = asyncHandler(async (req: any, res: any) => {

    let token: string;
    token = req.cookies.jwt;

    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    return res.status(200).json({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.roles,
        createdAt: user?.createdAt
    })
})


// update User
const updateUserProfile = asyncHandler(async (req: any, res: any) => {

    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save();
        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        })

    } else {
        res.status(404)
        throw new Error('User not Found')
    }

})

// create new access token 
const newAccessToken = asyncHandler(async (req: any, res: any, next) => {
    const { JWT_SECRET } = process.env
    const oldAccessToken = req.cookies.jwt;
    let decoded: any;
    if (oldAccessToken)

        decoded = jwt.verify(oldAccessToken, JWT_SECRET as string);
    // @ts-ignore
    const idUser = decoded._id;

    const RefreshToken = await UserToken.findOne({ userId: idUser });
    const refreshToken = RefreshToken?.token

    const tokendetails :any = await verifyRefreshToken(refreshToken)
    const payload = {_id : tokendetails._id  ,roles:tokendetails.roles}
    
    
    try {
        const accessToken = await jwt.sign(
            payload,
            JWT_SECRET as string,
            { expiresIn: "15m" }
        )
        await res.cookie('jwt', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 1000
        })
        next()
    } catch (error) {
        return res.status(400).json(error)
    }
})


const logoutUser = asyncHandler(async (req: any, res: any) => {
    const oldAccessToken = req.cookies.jwt;

    if (oldAccessToken) {
        // @ts-ignore
        const decoded = jwt.verify(oldAccessToken, process.env.JWT_SECRET);
        try {
            const idUser = decoded._id;
            const RefreshToken = await UserToken.findOne({ userId: idUser });
            if (!RefreshToken) return res.status(200).json({ error: false, message: "Logout Successfully " })
            await RefreshToken.deleteOne()
            await res.cookie('jwt', '', {
                expires: new Date(0)
            });
            res.status(200).json({ error: false, message: "Logout Successfully" })
        } catch (error) {
            res.status(500).json({ error: true, message: "Internal Server Error" })
        }
    } else {
        return res.status(400).json({ error: true, message: "try Login" })
    }
})

// hamza el bakkouri 💀

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    newAccessToken
}
