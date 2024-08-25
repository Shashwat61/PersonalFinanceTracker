import { gmailClient } from "../lib"


const getTransactions = async (accessToken: string, apiQuery: string) => {
    console.log('getting from gmail api client')
    const response = await gmailClient.getMessages(accessToken, apiQuery)
    // find unique threadIds
    const uniqueThreadIds = [...new Set(response.messages.map((message: {id:string, threadId:string})=> message.threadId))];
    console.log(uniqueThreadIds, '======unique threadids')
    // get emails from unique threadIds
    const transactions = uniqueThreadIds.map(async(uniqueThreadId)=> await gmailClient.getEmailsFromThreads(uniqueThreadId, accessToken))
    console.log(transactions, '======')
    const transactionData = await Promise.all(transactions)
    console.log(transactionData,'=====transactiondata')
    // modify data in the format of transaction model
    
    return transactionData
}

export default {
    getTransactions
}