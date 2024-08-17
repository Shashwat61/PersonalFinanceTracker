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
        if (!tokenIdInfo) throw Error('token id not found, please sign in again')
        console.log(tokenIdInfo.getPayload()!.email!, 'hashkey')
        const accessToken = await redisClient.getKey('access_token')
        console.log(accessToken, 'accesstoken')
        if (accessToken === undefined) throw Error('Access token not found, Please sign in again')
        const user = await User.findOneBy({email: tokenIdInfo?.getPayload()?.email})
        if(!user) throw Error('User not found')
        res.locals.userInfo = {...user, accessToken}
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