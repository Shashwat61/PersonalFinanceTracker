import express, { Request, Response } from 'express';
import authRoutes from './auth.routes';
import tranasctionRoutes from './transaction.routes';
import bankEmailRoutes from './watch-email.routes';
import bankRoutes from './bank.routes';
import userBankRoutes from './user-bank.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import { apiMiddleware } from '../middlewares';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the API');
})

router.use('/auth', authRoutes);

// protected and public routes configure
router.use('/banks', apiMiddleware.checkApiAutheticated, bankRoutes);
router.use('/banks/user', apiMiddleware.checkApiAutheticated, userBankRoutes);
router.use(
  '/transactions',
  apiMiddleware.checkApiAutheticated,
  tranasctionRoutes,
);
router.use(
  '/watch_emails',
  apiMiddleware.checkApiAutheticated,
  bankEmailRoutes,
);
router.use('/user', apiMiddleware.checkApiAutheticated, userRoutes);
router.use('/categories', apiMiddleware.checkApiAutheticated, categoryRoutes);

export default router;
