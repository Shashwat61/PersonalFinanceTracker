import express from 'express'
import transactionController from '../controllers/transaction.controller'
const router = express.Router()


router.get('/', transactionController.getTransactions)

export default router