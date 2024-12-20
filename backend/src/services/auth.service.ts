import {
  clearCookie,
  cookieOptions,
  getAuthenticatedInfo,
  oAuth2ClientInstance,
  setCookies,
} from '@utils/helper';
import { Response } from 'express';
import { redisClient } from '@lib';
import { User } from '@entity/User';
import { BEARER_TOKEN } from '@utils/constants';

const signup = () => {
  const oAuth2Client = oAuth2ClientInstance();

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly email profile',
  });
  return authorizeUrl;
};

const signIn = async (code: string, res: Response) => {
  try {
    const { tokens, tokenIdInfo } = await getAuthenticatedInfo(code as string);
    const { id_token } = tokens;
    if (tokenIdInfo && id_token && id_token.length > 0) {
      const userFound = await User.findOne({
        where: {
          email: tokenIdInfo.email?.toLowerCase(),
        },
      });
      if (userFound) {
        console.log(userFound, '==========userFound', tokenIdInfo);
        if (tokenIdInfo && tokenIdInfo.email && tokens.access_token) {
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          const maxAgeInSeconds =
            (tokenIdInfo.exp - currentTimeInSeconds) * 1000;
          const resp = await redisClient.setKey(
            tokenIdInfo.email,
            tokens.access_token,
            maxAgeInSeconds,
          );
          console.log(resp, 'resp');
          if (resp !== 'OK') throw new Error('error in setting redis key');
          setCookies(res, id_token, tokenIdInfo);
          return userFound;
        }
      }
      const user = new User();
      user.email = tokenIdInfo.email!;
      user.name = tokenIdInfo.name!;
      await user.save();

      console.log(user, '==========user', tokenIdInfo);
      if (tokenIdInfo && tokenIdInfo.email && tokens.access_token) {
        console.log(
          tokenIdInfo.email,
          tokens.access_token,
          tokenIdInfo.exp,
          '===============tokenid',
        );
        const resp = await redisClient.setKey(
          user.email,
          tokens.access_token,
          tokenIdInfo.exp,
        );
        console.log(resp, '===========resp');
        setCookies(res, id_token, tokenIdInfo);
        return user;
      }
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    throw Error(error as string);
  }
};

const logout = async(response: Response) => {
  const {currentUser} = response.locals.userInfo
  await redisClient.deleteKey(currentUser.email);
  delete response.locals.userInfo;
  // this works in production but not in development
  if(process.env.NODE_ENV==="production") clearCookie(response, BEARER_TOKEN, cookieOptions);
  return;
  // TODO: remove the cookie from the client from here how?
}

export default {
  signup,
  signIn,
  logout
};
