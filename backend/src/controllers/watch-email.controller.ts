import { Request, Response } from 'express';
import services from '@services/index';
import indexValidation from '@validations/index.validation';


const getAllBankEmails = async (req: Request, res: Response) => {
  try {
    const { body } =
      indexValidation.watchEmailValidations.getAllWatchEmails.parse(req);
    const bankEmails = await services.watchEmailService.getAllBankEmails(
      body.userId,
      res.locals.userInfo,
    );
    res.status(200).json({ response: bankEmails });
  } catch (err) {
    console.error(err, 'in error block');
    res
      .status(500)
      .json({ error_message: (err as Error).message });
  }
};

const addBankEmail = async (req: Request, res: Response) => {
  try {
    const { body } =
      indexValidation.watchEmailValidations.addWatchEmail.parse(req);
    const bankEmail = await services.watchEmailService.addBankEmail(
      body.email,
      body.userId,
      res.locals.userInfo,
    );
    res.status(200).json(bankEmail);
  } catch (err) {
    console.error(err, 'in error block');
    res
      .status(500)
      .json({ error_message: (err as Error).message });
  }
};

export default {
  getAllBankEmails,
  addBankEmail,
};
