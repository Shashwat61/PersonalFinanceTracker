import express, { Request, Response } from 'express'
const router = express.Router()
import authRoutes from './auth.routes'
import controllers from '../controllers'
import { authMiddleware } from '../middlewares'



router.use('/api/auth', authRoutes)

router.get('/', authMiddleware.checkForUserSession, controllers.rootRouteController)

router.get('/signin', authMiddleware.checkForUserSession, (req:Request,res:Response)=>{
    if (res.locals.user) res.redirect('/app')
    res.render('signin')
})

router.get('/app', authMiddleware.checkForUserSession, (req,res)=>{
    res.render('app')
})




export default router