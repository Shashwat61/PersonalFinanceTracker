import { Category } from '@entity/Category';

const getCategories = async () => {
  const categories = await Category.find();
  return categories;
};

export default {
  getCategories,
};
