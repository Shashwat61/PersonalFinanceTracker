import express from 'express';
import authRoutes from './auth.routes'
import tranasctionRoutes from './transaction.routes'
import { apiMiddleware } from '../middlewares';

const router = express.Router()
router.use('/auth', authRoutes)
// protected and public routes configure
router.use('/transactions', apiMiddleware.checkApiAutheticated,  tranasctionRoutes)



export default router;