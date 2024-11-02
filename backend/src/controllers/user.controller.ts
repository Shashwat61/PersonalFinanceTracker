import { Request, Response } from 'express';
import services from '@services/index';

const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { currentUser } = res.locals.userInfo;

    const user = await services.userService.getUserDetails(currentUser.id);
    res.json(user).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export default {
  getUserDetails,
};
