import { Request, Response } from "express"
import services from "../services"

const signUp = async(req:Request, res: Response) => {
    const redirectURL = services.authService.signup()
    res.redirect(redirectURL)
}


const signIn = async(req: Request, res: Response)=>{
    try {
        console.log('here in signin')
        const {error, code} = req.query
        if(error) throw new Error(error as string)
        const userProfileData = await services.authService.signIn(code as string, res)
        console.log('===========here in signin redirecting', userProfileData)
        // if user profile data successful, then redirect to /app
        res.redirect('/app')
    } 
    catch (error) {
        console.log((error as Error).message)
        res.redirect(`/signin?error=${(error as Error).message}`)

    }
}
export default {
    signUp,
    signIn
}