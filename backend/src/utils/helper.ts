import { OAuth2Client, TokenPayload } from "google-auth-library";
import { userProfileData } from "../types/auth.types";
import { CookieOptions, Response } from "express";

function oAuth2ClientInstance(){
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
}
async function getAuthenticatedInfo(code:string) {
    const oAuth2Client = oAuth2ClientInstance();
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens)
    oAuth2Client.setCredentials(tokens);
    const tokenIdInfo = await getTokenIdInfo(tokens.id_token!)
    console.log(tokenIdInfo, 'tokeninfo')
    return {oAuth2Client: oAuth2Client, tokens, tokenIdInfo: tokenIdInfo!.getPayload()};
}

async function getAuthenticatedUserDetails(oAuth2Client: OAuth2Client){
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
    const {data}: {data: userProfileData} = await oAuth2Client.request({ url });
    return data
}
const cookieOptions: CookieOptions = {
    // httpOnly: true,
    domain: '',
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === "production"
}
function setCookies(res: Response, id_token: string, tokenIdInfo: TokenPayload){
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const maxAgeInSeconds = (tokenIdInfo.exp - currentTimeInSeconds) * 1000; // 1 hour
    res.cookie('jwt', id_token, {
        ...cookieOptions,
        maxAge: maxAgeInSeconds
    })
}
async function getTokenInfo(access_token: string){
    const tokenInfo = await oAuth2ClientInstance().getTokenInfo(access_token)
    return tokenInfo
}
async function getTokenIdInfo(token_id: string){
    try {    
        const tokenInfo = await oAuth2ClientInstance().verifyIdToken({
            idToken: token_id,
            audience: "9028270805-45bek9eucb5ei26q7pnp283ruoefffdc.apps.googleusercontent.com"
        })
        return tokenInfo
    } 
    catch (error) {
        
    }
}
export {
    getAuthenticatedInfo,
    getAuthenticatedUserDetails,
    setCookies,
    getTokenInfo,
    getTokenIdInfo,
    oAuth2ClientInstance
}