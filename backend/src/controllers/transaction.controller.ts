import { Request, Response } from 'express';
import transactionService from '@services/transaction.service';
import indexValidation from '@validations/index.validation';
import { User } from '@entity/User';

const saveTransactions = async (req: Request, res: Response) => {
  try {
    const {
      currentUser,
      accessToken,
    }: { currentUser: User; accessToken: string } = res.locals.userInfo;
    const { body } =
      indexValidation.transactionValidation.saveTransaction.parse(req);
    const response = await transactionService.saveTransaction(
      body,
      currentUser,
    );
    res.status(204).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const getTransactionsVersionTwo = async (req: Request, res: Response) => {
  try {
    const {
      currentUser,
      accessToken,
    }: { currentUser: User; accessToken: string } = res.locals.userInfo;
    const {
      query,
      params: { id: userBankMappingId },
    } =
      indexValidation.transactionValidation.getTransactionsVersionOne.parse(
        req,
      );
    const response = await transactionService.getTransactionsVersionTwo(
      accessToken,
      query,
      userBankMappingId,
      currentUser,
    );
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json((error as Error).message);
  }
};

const updateTransactions = async (req: Request, res: Response) => {
  try {
    const {
      currentUser,
      accessToken,
    }: { currentUser: User; accessToken: string } = res.locals.userInfo;
    const { body } =
      indexValidation.transactionValidation.updateTransactions.parse(req);
    const response = await transactionService.updateTransactions(
      body,
      currentUser,
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default {
  saveTransactions,
  getTransactionsVersionTwo,
  updateTransactions,
};
