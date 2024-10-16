import controllers from "../controllers"

const express = require('express')
const router = express.Router()

router.get('/', controllers.categoryController.getCategories)

export default router