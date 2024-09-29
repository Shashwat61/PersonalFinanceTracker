import { User } from "../entity/User"

const getUserDetails = async(userId: string) => {
    const user = User.findOne({
        where: {
            id: userId
        },
        relations: {
            banks: true,
        },
    })
    if (!user) throw new Error('user not found')
    return user
}

export default {
    getUserDetails
}