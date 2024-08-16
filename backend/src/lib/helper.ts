import { Credentials, LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { userProfileData } from "../types/auth.types";
import { CookieOptions, Response } from "express";

function oAuth2ClientInstance(){
    return new OAuth2Client(
        ""
      );
}
async function getAuthenticatedInfo(code:string) {
    const oAuth2Client = new OAuth2Client(
        ""
    );
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens)
    oAuth2Client.setCredentials(tokens);
    const tokenIdInfo = await getTokenIdInfo(tokens.id_token!)
    console.log(tokenIdInfo, 'tokeninfo')
    return {oAuth2Client: oAuth2Client, tokens, tokenIdInfo: tokenIdInfo.getPayload()};
}

async function getAuthenticatedUserDetails(oAuth2Client: OAuth2Client){
    console.log(oAuth2Client, 'authenticated isntance')
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
    const {data}: {data: userProfileData} = await oAuth2Client.request({ url });
    return data
}
const cookieOptions: CookieOptions = {
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'lax',
    secure: true
    // secure: process.env.NODE_ENV === 'production' ? true : false,
}
function setCookies(res: Response, id_token: string, tokenIdInfo: TokenPayload){
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const maxAgeInSeconds = tokenIdInfo.exp - currentTimeInSeconds;
    res.cookie('jwt', id_token, {
        ...cookieOptions,
        maxAge: maxAgeInSeconds
    })
    // set this in redis as it is required in BE not in FE
    // key would be tokenIdInfo.at_hash || name
    // res.cookie('access_token', access_token, {
    //     ...cookieOptions,
    //     maxAge: tokenIdInfo.exp
    // })
    // console.log('setting cookies ended')
}
async function getTokenInfo(access_token: string){
    const tokenInfo = await oAuth2ClientInstance().getTokenInfo(access_token)
    return tokenInfo
}
async function getTokenIdInfo(token_id: string){
    const tokenInfo = await oAuth2ClientInstance().verifyIdToken({
        idToken: token_id,
        audience: ""
    })
    return tokenInfo
}
export {
    getAuthenticatedInfo,
    getAuthenticatedUserDetails,
    setCookies,
    getTokenInfo,
    getTokenIdInfo
}