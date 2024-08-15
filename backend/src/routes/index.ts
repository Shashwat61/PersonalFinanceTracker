import express, { Request, Response } from 'express'
const router = express.Router()
import authRoutes from './auth.routes'
import controllers from '../controllers'
import { authMiddleware } from '../middlewares'



router.use('/api/auth', authRoutes)

router.get('/', authMiddleware.checkForUserSession, controllers.rootRouteController)

router.get('/signin', (req,res)=>{
    res.render('signin')
})




export default router