import { Request, Response } from "express"
import transactionService from "../services/transaction.service"

const getTransactions = async (req: Request, res: Response)=> {
    try {
        console.log('getting transactions')
        const {user, accessToken} = res.locals.userInfo
        const response = await transactionService.getTransactions(accessToken)
        console.log(response, 'response got in controller')
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json(error) 
    }
}

export default {
    getTransactions
}