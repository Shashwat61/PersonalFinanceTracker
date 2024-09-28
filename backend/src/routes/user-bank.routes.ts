import controllers from "../controllers"

const express = require('express')
const router = express.Router()

router.get('/:id', controllers.userBankController.getUserBanks)
router.post('/', controllers.userBankController.createUserBank)

export default router