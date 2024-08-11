import express, { Request, Response } from 'express'
const router = express.Router()
import authRoutes from './auth.routes'
import controllers from '../controllers'


router.use('/api/auth', authRoutes)

router.get('/', controllers.rootRouteController)



export default router