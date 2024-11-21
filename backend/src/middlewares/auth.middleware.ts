import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getTokenIdInfo, getTokenInfo } from '../utils/helper';
import { User } from '../entity/User';
import { BEARER_TOKEN } from '@utils/constants';

const checkForUserSession: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.headers.cookie?.split(';');
    console.log(cookies, '========cookies=======');
    if (cookies) {
      const jwt_token = cookies?.find(
        (cookie) => cookie.replace(/=.+$/, '').trim() === BEARER_TOKEN,
      );
      if (jwt_token) {
        const [jwt_prefix, jwt_token_value] = jwt_token.split('=');
        console.log(jwt_token_value, 'jwt token');
        const tokenIdInfo = await getTokenIdInfo(jwt_token_value);
        if (!tokenIdInfo) throw Error('wrong token');
        console.log(tokenIdInfo, 'tokenidinfo');
        const user = await User.findOneBy({
          email: tokenIdInfo?.getPayload()?.email?.toLowerCase(),
        });
        if (!user) throw Error('User not found');
        res.locals.user = user;
        console.log('user found');
        return next();
      }
    }
    console.log('here in login page');
    return next()
  } catch (error) {
    console.log(error);
    throw new Error(`something went wrong with message -${(error as Error).message}`)
  }
};

export default {
  checkForUserSession,
};
