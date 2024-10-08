import { Request, Response } from "express"
import services from "../services"
import userController from "./user.controller"


const rootRouteController = (req: Request, res: Response)=> {

    const response = services.rootRouterService()
    console.log('redirecting 5173')
    res.status(301).redirect('/app')
}


export default {
    rootRouteController,
    userController

}