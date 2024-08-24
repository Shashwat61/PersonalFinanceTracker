import { Request, Response } from "express"
import services from "../services"
import indexValidation from "../validations/index.validation"
import { HttpStatusCode } from "axios"

const getAllBankEmails = (req: Request, res: Response) => {
    const bankEmails = services.bankEmailService.getAllBankEmails()
}

const addBankEmail = async (req: Request, res: Response) => {
    try{
        const {body} = indexValidation.bankEmailValidations.addBankEmail.parse(req)
        console.log(body, '=======body')
        const bankEmail = await services.bankEmailService.addBankEmail(body.email, body.userId, res.locals.userInfo)
        console.log(bankEmail, 'response')
        res.status(HttpStatusCode.Ok).json(bankEmail)
    }
    catch(err){
        console.error(err, 'in error block')
        res.status(HttpStatusCode.Conflict).json({error_message: (err as Error).message})
    }
}

export default {
    getAllBankEmails,
    addBankEmail
}