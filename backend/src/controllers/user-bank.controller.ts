import { Request, Response } from "express";
import services from "../services";

const getUserBanks = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const banksList = await services.userBankService.getUserBanks(id)
        res.json(banksList).status(200)
    }catch(err){
        console.error(err);
        res.status(500).json(err)
    }
}

const createUserBank = async (req: Request, res: Response) => {
    try {
        const {bankId, userId, accountNumber} = req.body
        await services.userBankService.createUserBank(userId, bankId, accountNumber)
        res.sendStatus(204)
    } catch (error) {
        console.log((error as Error).message, 'error')
        res.status(500).json((error as Error).message)
    }
}
export default {
    getUserBanks,
    createUserBank
}