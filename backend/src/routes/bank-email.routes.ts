import express from 'express'
import controllers from '../controllers'
import indexValidation from '../validations/index.validation'
import { validationMiddleware } from '../middlewares'
const router = express.Router()
const {validate} = validationMiddleware
const {bankEmailValidations} = indexValidation

router.get('/', controllers.bankEmailController.getAllBankEmails)
router.post('/create', validate(bankEmailValidations.addBankEmail), controllers.bankEmailController.addBankEmail)


export default router