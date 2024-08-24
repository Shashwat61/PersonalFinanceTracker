import express from 'express'
import controllers from '../controllers'
import indexValidation from '../validations/index.validation'
import { validationMiddleware } from '../middlewares'
const router = express.Router()
const {validate} = validationMiddleware
const {watchEmailValidations} = indexValidation

router.get('/', validate(watchEmailValidations.getAllWatchEmails), controllers.bankEmailController.getAllBankEmails)
router.post('/create', validate(watchEmailValidations.addWatchEmail), controllers.bankEmailController.addBankEmail)


export default router