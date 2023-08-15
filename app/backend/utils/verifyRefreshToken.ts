import jwt from 'jsonwebtoken';
import UserToken from '../models/userTokenModel';

const verifyRefreshToken = async (refreshToken: any) => {
    const refreshKey = process.env.REFRESH_SECRET;

    try {
        const doc = await UserToken.findOne({ token: refreshToken }).exec();
        if (!doc) {
            return { error: true, message: "Invalid refresh Token" };
        }

        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, refreshKey as string, (err: any, tokendetails: any) => {
                if (err) {
                    reject({ error: true, message: "Invalid refresh Token" });
                } else {
                    resolve(tokendetails);
                }
            });
        });
    } catch (error) {
        return { error: true, message: "An error occurred" };
    }
};

export default verifyRefreshToken;
