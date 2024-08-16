import { OAuth2Client } from "google-auth-library";
import { getAuthenticatedInfo, getAuthenticatedUserDetails, oAuth2ClientInstance, setCookies } from "../utils/helper";
import { Response } from "express";
import { redisClient } from "../lib";
import { User } from "../entity/User";

const signup = ()=>{
    const oAuth2Client = oAuth2ClientInstance()
    
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/ email profile',
      });
      return authorizeUrl
}

const signIn = async(code: string, res: Response)=> {
    try {
        const {tokens, tokenIdInfo} = await getAuthenticatedInfo(code as string);
        const {id_token} = tokens
        if (tokenIdInfo && id_token && id_token.length > 0){
          const userFound = await User.findOne({
            where: {
              email: tokenIdInfo.email
            }
          })
          if(userFound){
            console.log(userFound, '==========userFound')
            redisClient.setKey(tokenIdInfo.at_hash!, tokens.access_token!, tokenIdInfo.exp)
            setCookies(res, id_token, tokenIdInfo)
            return userFound
          }
          const user = new User()
          user.email = tokenIdInfo.email!
          user.name = tokenIdInfo.name!
          await user.save()
          
          console.log(user, '==========user')
            redisClient.setKey(tokenIdInfo.at_hash!, tokens.access_token!, tokenIdInfo.exp)
            setCookies(res, id_token, tokenIdInfo)
            return user
        }
        // store this in user table
        // return userprofiledata
      } catch (error) {
        console.error('Error during authentication:', error);
        throw Error(error as string)
      }
}

export default {
    signup,
    signIn
}