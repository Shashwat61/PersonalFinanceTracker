import express from 'express'
import userController from '../controllers/auth.controller'
import { validationMiddleware } from '../middlewares'
import indexValidation from '../validations/index.validation'
const {authValidation} = indexValidation
const {validate} = validationMiddleware
const router = express.Router()

// this route will basically signup and signin the user, as I am not using any other method other than google sign in so no need for sign in route
router.post('/sign_up', userController.signUp)
router.get('/oauth2callback', validate(authValidation.oAuthCallbackValidation), userController.signIn)

export default router