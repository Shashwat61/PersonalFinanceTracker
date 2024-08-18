import axios from "axios"
import { redisClient } from "../lib"
import { GmailMessages } from "../types/transaction.types"


const prefixURL = process.env.GMAIL_API_ENDPOINT_URL
 const getMails = async (accessToken:string) => {
    try{
        const response = await axios.get<GmailMessages>(`${prefixURL}/me/messages?q=from:alerts@hdfcbank.net`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }
    catch(error){
        console.error(error, 'error')
    }
}

export {
    getMails
}