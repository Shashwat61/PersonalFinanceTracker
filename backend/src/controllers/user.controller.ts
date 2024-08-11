import { Request, Response } from "express"
import services from "../services"

const signUp = (req:Request, res: Response) => {
    const response = services.userService.signup()
    res.status(200).send(response)
}

export default {
    signUp
}