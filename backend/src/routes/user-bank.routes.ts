import controllers from '@controllers';
import { validationMiddleware } from '@middlewares';
import userbankValidation from '@validations/userbank.validation';

const express = require('express');
const router = express.Router();

router.get('/:id', controllers.userBankController.getUserBanks);
router.post(
  '/',
  validationMiddleware.validate(userbankValidation.createUserBank),
  controllers.userBankController.createUserBank,
);

export default router;
