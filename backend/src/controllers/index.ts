import { Request, Response } from "express"
import services from "../services"
import userController from "./user.controller"


const rootRouteController = (req: Request, res: Response)=> {
    const response = services.rootRouterService()
    res.status(200).send(response)
}


export default {
    rootRouteController,
    userController

}