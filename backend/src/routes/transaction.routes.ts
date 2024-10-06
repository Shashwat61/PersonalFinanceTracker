import express from 'express'
import transactionController from '../controllers/transaction.controller'
import { validationMiddleware } from '../middlewares'
import indexValidation from '../validations/index.validation'
const router = express.Router()
const {validate} = validationMiddleware
const {transactionValidation} = indexValidation

router.get('/', validate(transactionValidation.getTransactions),  transactionController.getTransactions)
router.get('/v1', validate(transactionValidation.getTransactionsVersionOne), transactionController.getTransactionsVersionOne )
router.get('/v2', validate(transactionValidation.getTransactionsVersionOne), transactionController.getTransactionsVersionTwo)
router.post('/save_transactions', transactionController.saveTransactions)

export default router