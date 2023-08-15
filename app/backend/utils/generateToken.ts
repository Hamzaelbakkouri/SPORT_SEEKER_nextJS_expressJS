import jwt from "jsonwebtoken";
import UserToken from "../models/userTokenModel";


const generateTokens = async (user: any) => {
    try {
        const payload = { _id: user._id, roles: user.roles };

        const accessToken = jwt.sign(
            payload,
            // @ts-ignore
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            payload,
            // @ts-ignore
            process.env.REFRESH_SECRET,
            { expiresIn: "15d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) {
            // @ts-ignore
            await userToken.deleteOne()
        }
        await new UserToken({ userId: user._id, token: refreshToken }).save()
        return Promise.resolve({ accessToken, refreshToken })
    } catch (err) {
        return Promise.reject(err);
    }
}

export default generateTokens