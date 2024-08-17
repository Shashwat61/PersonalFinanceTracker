import axios from "axios"
import { redisClient } from "../lib"

const prefixURL = process.env.GMAIL_API_ENDPOINT_URL
 const getMails = async (accessToken:string) => {
    try{
        const response = await axios.get(`${prefixURL}/me/messages?q=from:alerts@hdfcbank.net`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log(response, 'response got for emails')
        return response
    }
    catch(error){
        console.error(error, 'error')
    }
}

export {
    getMails
}