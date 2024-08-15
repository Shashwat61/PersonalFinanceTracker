import { Request, Response } from "express"
import services from "../services"
import { OAuth2Client } from "google-auth-library";

const signUp = async(req:Request, res: Response) => {
    const oAuth2Client = new OAuth2Client(
        "9028270805-45bek9eucb5ei26q7pnp283ruoefffdc.apps.googleusercontent.com",
        "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",
        "http://localhost:3000/api/auth/oauth2callback"
      );
    
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/',
      });
      res.redirect(authorizeUrl);
}

async function getAuthenticatedClient(code:string) {
    const oAuth2Client = new OAuth2Client(
        "9028270805-45bek9eucb5ei26q7pnp283ruoefffdc.apps.googleusercontent.com",
        "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",
        "http://localhost:3000/api/auth/oauth2callback"
      );
  
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return {oAuth2Client, tokens};
  }
const signIn = async(req: Request, res: Response)=>{
    try {
        const code = req.query.code;
        const {oAuth2Client, tokens} = await getAuthenticatedClient(code as string);
        
    
        const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
        const result = await oAuth2Client.request({ url });
    
        console.log(result.data);
    
        const tokenInfo = await oAuth2Client.getTokenInfo(oAuth2Client.credentials.access_token!);
        console.log(tokenInfo);
    
        res.send({tokenInfo, user_info: result.data, tokens}).json();
      } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Authentication failed.');
      }
}
export default {
    signUp,
    signIn
}