import { OAuth2Client } from "google-auth-library";
import { getAuthenticatedInfo, getAuthenticatedUserDetails, oAuth2ClientInstance, setCookies } from "../utils/helper";
import { Response } from "express";
import { redisClient } from "../lib";

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
            // set redis access token
            console.log(tokenIdInfo.at_hash, 'key')
            redisClient.setKey(tokenIdInfo.at_hash!, tokens.access_token!, tokenIdInfo.exp)
            setCookies(res, id_token, tokenIdInfo)
            return tokenIdInfo
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