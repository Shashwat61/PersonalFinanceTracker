import express from 'express';
import transactionController from '@controllers/transaction.controller';
import { validationMiddleware } from '@middlewares';
import indexValidation from '@validations/index.validation';
const router = express.Router();
const { validate } = validationMiddleware;
const { transactionValidation } = indexValidation;

router.get(
  '/v2/:id',
  validate(transactionValidation.getTransactionsVersionOne),
  transactionController.getTransactionsVersionTwo,
);
router.post(
  '/add',
  validate(transactionValidation.saveTransaction),
  transactionController.saveTransactions,
);
router.put(
  '/',
  validate(transactionValidation.updateTransactions),
  transactionController.updateTransactions,
);

export default router;
