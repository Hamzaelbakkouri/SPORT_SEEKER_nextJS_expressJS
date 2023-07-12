import jwt from 'jsonwebtoken'
import UserToken from '../models/userTokenModel'

const verifyRefreshToken = (refreshToken: string) => {
    const refreshKey = process.env.REFRESH_SECRET

    return new Promise((resolve, reject) => {
        UserToken.findOne({ token: refreshToken }, (err: any, doc: any) => {
            if (!doc) return reject({ error: true, message: "Invalid refresh Token" })
            // @ts-ignore
            jwt.verify(refreshToken, refreshKey, (err: any, tokendetails: any) => {
                if (err)
                    return reject({ error: true, message: "Invalid refresh Token" })
                resolve({
                    tokendetails,
                    error: false,
                    message: "Valid refresh token",
                })
            })
        })
    })
}

export default verifyRefreshToken
