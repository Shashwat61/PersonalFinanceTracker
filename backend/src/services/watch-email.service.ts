import { dbSource } from "../config/dbSource"
import { User } from "../entity/User"
import { WatchEmail } from "../entity/WatchEmail"

const getAllBankEmails = async(userId: string, userInfo: {currentUser: User, access_token: string}) => {
    if (userId !== userInfo.currentUser.id) throw new Error('Not Authorized')
    const watchEmails = await WatchEmail.find({
        where: {
            users: {id: userInfo.currentUser.id}
        }
    })
    console.log(watchEmails, '====watchemails')
    return watchEmails
}

const addBankEmail = async(email: string, userId: string, userInfo: {currentUser: User, access_token: string}) => {
        console.log(email, userId, '======arguments')
        const {currentUser} = userInfo
        if (email === currentUser.email) throw new Error('cannot set watch email same as user email')
        if (userId !== currentUser.id) throw new Error('Not Authorized')
        const watchEmail = await WatchEmail.findOne({where: {email: email}})
        if (watchEmail) throw new Error('Email already exists')
        console.log('after throwing error')
        const res = await dbSource.manager.transaction(async(transactionalEntityManager)=> {
            const newWatchEmail = new WatchEmail()
            newWatchEmail.email = email
            console.log(newWatchEmail, '===new watch Email')
            newWatchEmail.users = []
            newWatchEmail.users.push(currentUser)
            const res = await transactionalEntityManager.save(newWatchEmail)
            console.log(res, '=====transaction response')
            // return newWatchEmail
        })
        console.log(res, '======res')
        return res
}

export default {
    getAllBankEmails,
    addBankEmail
}