import { Request, Response } from 'express';
import services from '@services/index';

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await services.categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json((error as Error).message);
  }
};

export default {
  getCategories,
};
