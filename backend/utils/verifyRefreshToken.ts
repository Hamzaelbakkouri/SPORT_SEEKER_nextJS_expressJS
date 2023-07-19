import jwt from 'jsonwebtoken';
import UserToken from '../models/userTokenModel';

const verifyRefreshToken = (refreshToken: any) => {
    const refreshKey = process.env.REFRESH_SECRET;

    return new Promise(async (resolve, reject) => {
        try {
            const doc = await UserToken.findOne({ token: refreshToken }).exec();
            if (!doc) {
                return reject({ error: true, message: "Invalid refresh Token" });
            }
            // @ts-ignore
            jwt.verify(refreshToken, refreshKey, (err: any, tokendetails: any) => {
                if (err) {
                    return reject({ error: true, message: "Invalid refresh Token" });
                }
                resolve({
                    tokendetails,
                    error: false,
                    message: "Valid refresh token",
                });
            });
        } catch (error) {
            reject({ error: true, message: "An error occurred" });
        }
    });
};

export default verifyRefreshToken;
