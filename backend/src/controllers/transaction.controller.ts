import { Request, Response } from "express"
import transactionService from "../services/transaction.service"
import indexValidation from "../validations/index.validation"
import { modifyQuery } from "../utils/helper"
import { User } from "../entity/User"

const saveTransactions = async (req: Request, res: Response)=>{
    try {
        const {currentUser, accessToken}: {currentUser: User, accessToken: string} = res.locals.userInfo
        // const {transactions} = indexValidation.transactionValidation.saveTransactions.parse(req)
        // const response = await transactionService.saveTransactions(transactions, currentUser)
        res.status(200).json([])
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }   
}


const getTransactionsVersionTwo = async(req: Request, res:Response)=>{
    try {
        const {currentUser, accessToken}: {currentUser: User, accessToken: string} = res.locals.userInfo
        const {query} = indexValidation.transactionValidation.getTransactionsVersionOne.parse(req)
        const response = await transactionService.getTransactionsVersionTwo(accessToken, query, currentUser)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json((error as Error).message)
    }
}

export default {
    saveTransactions,
    getTransactionsVersionTwo
}