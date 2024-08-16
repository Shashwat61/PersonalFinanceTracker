import { Credentials, OAuth2Client } from "google-auth-library";
import { userProfileData } from "../types/auth.types";
import { CookieOptions, Response } from "express";

async function getAuthenticatedInfo(code:string) {
    const oAuth2Client = new OAuth2Client(
        ""
      );
  
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return {oAuth2Client, tokens};
  }

async function getAuthenticatedUserDetails(oAuth2Client: OAuth2Client){
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
    const {data}: {data: userProfileData} = await oAuth2Client.request({ url });
    return data
}
const cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'lax'
    // secure: process.env.NODE_ENV === 'production' ? true : false,
}
function setCookies(res: Response, access_token: string, expiry_date: number, id_token: string){
    console.log('setting cookies')
    // set cookies
    res.cookie('access_token', access_token, {
        ...cookieOptions,
        maxAge: expiry_date
    })
    res.cookie('jwt', id_token, {
        ...cookieOptions,
        maxAge: expiry_date
    })
    console.log('setting cookies ended')
}

export {
    getAuthenticatedInfo,
    getAuthenticatedUserDetails,
    setCookies
}