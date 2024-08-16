import { OAuth2Client } from "google-auth-library";
import { getAuthenticatedInfo, getAuthenticatedUserDetails, setCookies } from "../lib/helper";
import { Response } from "express";

const signup = ()=>{
    const oAuth2Client = new OAuth2Client(
        ""
      );
    
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/ email profile',
      });
      return authorizeUrl
}

const signIn = async(code: string, res: Response)=> {
    console.log('here in signin service')
    try {
        const {oAuth2Client, tokens} = await getAuthenticatedInfo(code as string);
        const userProfileData = await getAuthenticatedUserDetails(oAuth2Client)
        console.log(tokens, 'tokens')
        const {access_token, expiry_date, id_token} = tokens
        console.log(access_token && access_token.length > 0 && expiry_date && id_token && id_token.length > 0, 'bool')
        if (access_token && access_token.length > 0 && expiry_date && id_token && id_token.length > 0){
            setCookies(res, access_token, expiry_date, id_token)
            return userProfileData
        }
        console.log(res.cookie, 'set cookies')
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