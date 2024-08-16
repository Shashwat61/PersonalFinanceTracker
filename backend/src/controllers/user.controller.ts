import { Request, Response } from "express"
import services from "../services"

const signUp = async(req:Request, res: Response) => {
    const redirectURL = services.userService.signup()
    res.redirect(redirectURL)
}


const signIn = async(req: Request, res: Response)=>{
    console.log('here in signin')
    const code = req.query.code
    const userProfileData = await services.userService.signIn(code as string, res)
    console.log('here in signin redirecting')
    res.redirect('/')
}
export default {
    signUp,
    signIn
}