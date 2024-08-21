import { gmailClient } from "../lib"


const getTransactions = async (accessToken: string, apiQuery: string) => {
    console.log('getting from gmail api client')
    const response = await gmailClient.getEmails(accessToken, apiQuery)
    return response
}

export default {
    getTransactions
}