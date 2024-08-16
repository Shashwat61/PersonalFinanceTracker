import { Request, Response } from "express"
import services from "../services"
import userController from "./user.controller"


const rootRouteController = (req: Request, res: Response)=> {

    const response = services.rootRouterService()
    console.log('in here')
    console.log(req.cookies, req.headers.cookie)
    res.status(301).redirect('http://localhost:5173')
}


export default {
    rootRouteController,
    userController

}