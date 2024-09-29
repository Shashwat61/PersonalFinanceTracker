import { Request, Response } from "express"
import services from "../services"

const signUp = async(req:Request, res: Response) => {
    const redirectURL = services.authService.signup()
    res.redirect(redirectURL)
}


const signIn = async(req: Request, res: Response)=>{
    console.log('here in signin')
    const code = req.query.code
    const userProfileData = await services.authService.signIn(code as string, res)
    console.log('===========here in signin redirecting', userProfileData)
    // if user profile data successful, then redirect to /app
    res.redirect('/app')
}
export default {
    signUp,
    signIn
}