import { Bank } from '@entity/Bank';
import { User } from '@entity/User';
import { UserBankMapping } from '@entity/UserBankMapping';

const getUserBanks = async (id: string) => {
  const userBankList = await User.findOne({
    where: {
      id,
    },
    relations: ['banks'],
  });
  return userBankList?.banks;
};

const createUserBank = async (
  userId: string,
  bankId: string,
  accountNumber: number,
) => {
  console.log(bankId, userId, 'create user bank');
  const bank = await Bank.findOneBy({ id: bankId });
  if (!bank) {
    throw new Error('Bank not found');
  }
  const user = await User.findOneBy({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  const userBankMapping = new UserBankMapping();
  userBankMapping.user_id = userId;
  userBankMapping.bank_id = bankId;
  userBankMapping.account_number = accountNumber;
  await userBankMapping.save();
};

export default {
  getUserBanks,
  createUserBank,
};
