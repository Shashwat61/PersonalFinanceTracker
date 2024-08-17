import express, { Request, Response } from 'express'
const router = express.Router()

import controllers from '../controllers'
import { authMiddleware } from '../middlewares'

import apiRoutes from './api.routes'

router.use('/api', apiRoutes)

router.get('/', authMiddleware.checkForUserSession, controllers.rootRouteController)

router.get('/signin', authMiddleware.checkForUserSession, (req:Request,res:Response)=>{
    console.log(req.url, req.route.path)
    if (res.locals.user) res.redirect('/app')
    res.render('signin')
})

router.get('/app', authMiddleware.checkForUserSession, (req,res)=>{
    res.render('app')
})




export default router