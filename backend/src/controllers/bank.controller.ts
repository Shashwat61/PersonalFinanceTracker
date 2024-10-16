import { Request, Response } from "express";
import services from "../services";

const getBanksList = async (req: Request, res: Response) => {
    try{
        const banksList = await services.bankService.getBanksList()
        res.json(banksList).status(200)
    }catch(err){
        console.error(err);
        res.status(500).json(err)
    }
}
export default {
    getBanksList
}