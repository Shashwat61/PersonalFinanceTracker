import express from 'express'
import transactionController from '../controllers/transaction.controller'
import { validationMiddleware } from '../middlewares'
import indexValidation from '../validations/index.validation'
const router = express.Router()
const {validate} = validationMiddleware
const {transactionValidation} = indexValidation

router.get('/', validate(transactionValidation.getTransactions),  transactionController.getTransactions)

export default router