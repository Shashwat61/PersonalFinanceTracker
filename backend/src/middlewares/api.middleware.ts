import { NextFunction, Request, Response } from "express";
import { getTokenIdInfo } from "../utils/helper";
import { User } from "../entity/User";
import { redisClient } from "../lib";

const checkApiAutheticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.headers.cookie?.split(';')
        const jwtToken = cookies?.find(cookie => cookie.includes("token"))
        if (!jwtToken) throw Error('JWT token not found, please sign in again')
        const [jwt_prefix, jwt_token_value] = jwtToken.split('=')
        const tokenIdInfo = await getTokenIdInfo(jwt_token_value)
        console.log(tokenIdInfo, 'tokenidinfo')
        if (!tokenIdInfo || !tokenIdInfo.getPayload()) throw Error('token id not found, please sign in again')
        console.log(tokenIdInfo.getPayload()?.email!, 'hashkey')
        const email = tokenIdInfo.getPayload()?.email;
        if (!email) throw new Error('Email not found');
        const accessToken = await redisClient.getKey(email);
        console.log(accessToken, 'accesstoken')
        if (!accessToken) throw new Error('Access token not found, Please sign in again');
        const user = await User.findOneBy({email: tokenIdInfo?.getPayload()?.email})
        if(!user) throw Error('User not found')
        res.locals.userInfo = {currentUser:user, accessToken}
        console.log("user found")
        return next()
        // how to get error message 

    } catch (error) {
        console.log('in error block', error as Error);
        console.log(error as Error);
        res.status(500).json({ message: (error as Error).message });
    }
}
export default {
    checkApiAutheticated
}