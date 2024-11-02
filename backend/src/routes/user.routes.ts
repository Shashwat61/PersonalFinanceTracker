import userController from '@controllers/user.controller';

const express = require('express');

const router = express.Router();

router.get('/me', userController.getUserDetails);

export default router;
