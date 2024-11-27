import { NextFunction, Request, Response } from 'express';
import { getTokenIdInfo } from '@utils/helper';
import { User } from '@entity/User';
import { redisClient } from '@lib';
import { BEARER_TOKEN } from '@utils/constants';

const checkApiAutheticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.headers.cookie?.split(';');
    console.log(cookies, '========cookies in api middleware=======');
    const authorizationToken = cookies?.find(
      (cookie) => cookie.replace(/=.+$/, '').trim() === BEARER_TOKEN,
    )?.split('=')[1];
    console.log(authorizationToken, '========authorizationtoken=======');
    if (!authorizationToken)
      throw Error('JWT token not found, please sign in again');
    const tokenIdInfo = await getTokenIdInfo(authorizationToken);
    console.log(tokenIdInfo, 'tokenidinfo');
    if (!tokenIdInfo || !tokenIdInfo.getPayload())
      throw Error('token id not found, please sign in again');
    console.log(tokenIdInfo.getPayload()?.email, 'hashkey');
    const email = tokenIdInfo.getPayload()?.email;
    if (!email) throw new Error('Email not found');
    const accessToken = await redisClient.getKey(email);
    console.log(accessToken, 'accesstoken');
    if (!accessToken)
      throw new Error('Access token not found, Please sign in again');
    const user = await User.findOneBy({
      email: tokenIdInfo?.getPayload()?.email?.toLowerCase(),
    });
    if (!user) throw Error('User not found');
    res.locals.userInfo = { currentUser: user, accessToken };
    console.log('user found');
    return next();
    // how to get error message
  } catch (error) {
    console.log('in error block', error as Error);
    console.log(error as Error);
    res.status(401).json({ message: 'Unauthorized, Please signin again' });
  }
};
export default {
  checkApiAutheticated,
};
