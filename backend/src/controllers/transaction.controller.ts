import { Request, Response } from "express"
import transactionService from "../services/transaction.service"
import indexValidation from "../validations/index.validation"
import { modifyQuery } from "../utils/helper"

const getTransactions = async (req: Request, res: Response)=> {
    try {
        console.log('getting transactions')
        const {user, accessToken} = res.locals.userInfo
        const {query} = indexValidation.transactionValidation.getTransactions.parse(req)
        const modifiedQuery = modifyQuery(query)
        console.log(modifiedQuery, '=======query======')
        const response = await transactionService.getTransactions(accessToken, modifiedQuery)
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