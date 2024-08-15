import express from 'express'
import userController from '../controllers/user.controller'
const router = express.Router()

// this route will basically signup and signin the user, as I am not using any other method other than google sign in so no need for sign in route
router.post('/sign_up', userController.signUp)
router.get('/oauth2callback', userController.signIn)

export default router