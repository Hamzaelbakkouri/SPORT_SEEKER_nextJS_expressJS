import jwt from 'jsonwebtoken';
import { refreshToken } from './../interfaces/index';
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
            return res.status(401).jddon({ error: true, message: "Invalid email or password" })

        const { accessToken, refreshToken } = await generateToken(user)
        res.status(200).json({
            message: "Logged success",
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken
        })
        res.cookie('access', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'developement',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 1000
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


// lougout User
// const logoutUser = asyncHandler(async (req: any, res: any) => {
//     res.cookie('jwt', '', {
//         httpOnly: true,
//         expires: new Date(0)
//     });
//     res.status(200).json({ Message: "user logged out" })
// })


// get profile User
const getUserProfile = asyncHandler(async (req: any, res: any) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.roles
    }

    res.status(200).json(user)
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
const newAccessToken = asyncHandler(async (req: any, res: any) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
        return res.status(400).json({ error: true, message: error.details[0].message })

    verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails }: any) => {
            const payload = { _id: tokenDetails._id, roles: tokenDetails.roles }
            const accessToken = jwt.sign(
                payload,
                // @ts-ignore
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            )
            res.status(200).json({
                error: false,
                accessToken,
                message: "Access token created successfully"
            })
        })
        .catch((err) => res.status(400).json(err))
})


const logoutUser = asyncHandler(async (req: any, res: any) => {
    try {
        res.cookie('access', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        const { error } = refreshTokenBodyValidation(req.body);
        if (error)
            return res.status(400).json({ error: true, message: error.details[0].message })

        const userToken = await UserToken.findOne({ token: req.body.refreshToken })
        if (!userToken) return res.status(200).json({ error: false, message: "Logout Successfully " })

        await userToken.deleteOne()
        res.status(200).json({ error: true, message: "Logout Successfully" })
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    newAccessToken
}
