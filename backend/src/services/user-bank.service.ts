import { Bank } from "../entity/Bank"
import { User } from "../entity/User"
import { UserBankMapping } from "../entity/UserBankMapping"

const getUserBanks = async (id: string)=> {
    const userBankList = await UserBankMapping.find({
        where: {
            user_id: id
        },
    })
    return userBankList
}

const createUserBank = async (userId: string, bankId: string) => {
    console.log(bankId, userId, 'create user bank')
    const bank = await Bank.findOneBy({id: bankId})
    if (!bank) {
        throw new Error("Bank not found")
    }
    const user = await User.findOneBy({id: userId})
    if (!user) {
        throw new Error("User not found")
    }
    let userBankMapping = new UserBankMapping()
    userBankMapping.user_id = userId
    userBankMapping.bank_id = bankId
    await userBankMapping.save()
}

export default {
    getUserBanks,
    createUserBank
}