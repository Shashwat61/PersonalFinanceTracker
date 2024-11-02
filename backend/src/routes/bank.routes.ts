import controllers from '@controllers';

const express = require('express');
const router = express.Router();

router.get('/', controllers.bankController.getBanksList);
router.get('/user', controllers.bankController.getBanksList);

export default router;
