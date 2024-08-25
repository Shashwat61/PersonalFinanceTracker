import { Request, Response } from "express"
import transactionService from "../services/transaction.service"
import indexValidation from "../validations/index.validation"
import { modifyQuery } from "../utils/helper"
import { User } from "../entity/User"

const getTransactions = async (req: Request, res: Response)=> {
    try {
        console.log('getting transactions')
        const {currentUser, accessToken}: {currentUser: User, accessToken: string} = res.locals.userInfo
        const {query} = indexValidation.transactionValidation.getTransactions.parse(req)
        const modifiedQuery = modifyQuery(query)
        const response = await transactionService.getTransactions(accessToken, modifiedQuery, currentUser)
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