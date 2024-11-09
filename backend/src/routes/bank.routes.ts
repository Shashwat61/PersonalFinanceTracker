import controllers from '@controllers';

import express from 'express';
const router = express.Router();

router.get('/', controllers.bankController.getBanksList);
router.get('/user', controllers.bankController.getBanksList);

export default router;
