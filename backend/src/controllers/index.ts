import { Request, Response } from 'express';
import services from '@services/index';
import authController from './auth.controller';
import transactionController from './transaction.controller';
import watchEmailController from './watch-email.controller';
import bankController from './bank.controller';
import userBankController from './user-bank.controller';
import userController from './user.controller';
import categoryController from './category.controller';

const rootRouteController = (req: Request, res: Response) => {
  const response = services.rootRouterService();
  console.log('redirecting 5173');
  res.status(301).redirect('/app');
};

export default {
  rootRouteController,
  authController,
  transactionController,
  watchEmailController,
  bankController,
  userBankController,
  userController,
  categoryController,
};
