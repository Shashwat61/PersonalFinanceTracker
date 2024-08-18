import { gmailClient } from "../lib"


const getTransactions = async (accessToken: string) => {
    console.log('getting from gmail api client')
    const response = await gmailClient.getEmails(accessToken)
    return response
}

export default {
    getTransactions
}