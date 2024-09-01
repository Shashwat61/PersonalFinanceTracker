import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { gmailClient, redisClient } from "../lib"
import { GmailThreadMessages, Message } from "../types/transaction.types";
import { modifyTransactionData } from "../utils/helper";

// get gmail messages
// build dummy transactions and send it to FE {id, amount, type, transacted_at, payee upi id, receiver, bank account number, userId}
// save it in redis with params received and userid
// now the user can see all transactions for date selected
// user can also filter all the transactions based on upi id.
// now if user filter through category, user won't be able to because as there is no category assigned to transactions.
// user will first have to add the category for that particular transaction.
// post api call to create transaction
    // can contain multiple transcations as from FE, if for same upi_id, all those will be updated and sent.
    // adding category to category table if doesn't exist.
    // adding entry in categoryusermapping if doesn't exist.
    // update transaction with category id
    // update the cache
// send updated transaction to FE.
// user can now filter via categories

// now user refreshes the page
// gmail messages api called
// 1st case
// resultsizestimate remains same
// get all transactions from cache 
// 2nd case
// resultsizeestimate changes
// slice the messages accordingly resultsizeestimate-cachestoreresultsizeestimate
// get unique threadIds
// get emails from unique threadIds
// {
//     "resultSizeEstimate": 4, 
//     "messages" : [
//       {
//         "id": "1919307694da4722", 
//         "threadId": "19193036f5437015"
//       }, 
//       {
//         "id": "191930465667536b", 
//         "threadId": "191930465667536b"
//       }, 
//       {
//         "id": "191930424221ef19", 
//         "threadId": "19193036f5437015"
//       }, 
//       {
//         "id": "19193036f5437015", 
//         "threadId": "19193036f5437015"
//       }
//     ]
//   }
// first result size was 1 and now 4.
// slice all the messages with diff and count for each thread Id.
// now i know the count of threadIds so if threadId is 2 then there i would have to pick the last 2 messages from threads api. keep this in hash
// get emails from unique threadIds
// slice the messages using hash count and build dummy transactions, parallely check if the upi id exist in categoryusermapping if it does, then save this transaction directly in db., clear the cache.
// after building these transactions, get from cache, if not present in cache, then get from db for exact date and append these dummy in starting and update the cache and send to FE.
// why dont do all the matching with the category and category mapping in the FE by sending all the user related data in the response and then match it in FE. (POSSIBLE try it)
// q=from:alerts@hdfcbank.net+after:2024/08/31+before:2024/09/01
const getTransactions = async(access_token: string, apiQuery: string, user: User) => {
    console.time("getting gmail message")
    const gmailMessages = await gmailClient.getMessages(access_token, apiQuery)
    console.timeEnd("getting gmail message")
    console.log(apiQuery, '=====params', gmailMessages)
    if (gmailMessages.resultSizeEstimate === 0) return []
    console.time("getting gmail cached result")
    const userCachedResultSizeEstimation = Number(await redisClient.getKey(`${user.id}:${apiQuery}:result_size_estimate`))
    console.log(userCachedResultSizeEstimation, '=======usercachedresultsize')
    console.timeEnd("getting gmail cached result")
    if (userCachedResultSizeEstimation){
        if (userCachedResultSizeEstimation === gmailMessages.resultSizeEstimate){
            const userCachedTransactions = await redisClient.getKey(`${user.id}:${apiQuery}:transactions`)
            if (userCachedTransactions) return JSON.parse(userCachedTransactions)
            // get from db
            console.log(apiQuery.match(/\\after:(\d{4}\/\d{2}\/\d{2})/)![1], '=====queried date ')
            const transactions = await Transaction.findBy({
                user_id: user.id,
                transacted_at: new Date(apiQuery.match(/\\after:(\d{4}\/\d{2}\/\d{2})/)![1])
            })
            return transactions
        }
        else {
            // logic for slicing and then responding with messages
            const difference = gmailMessages.resultSizeEstimate - userCachedResultSizeEstimation
            console.log("=======DIFFERENCE", difference)
            if (gmailMessages.messages && gmailMessages.messages.length > 0){
                const slicedMessages = gmailMessages.messages.slice(0, difference)
                const threadIdCount = new Map()
                slicedMessages.forEach(message=> {
                    if(threadIdCount.has(message.threadId)){
                        threadIdCount.set(message.threadId, threadIdCount.get(message.threadId)+1)
                    }
                    else {
                        threadIdCount.set(message.threadId, 1)
                    }
                })
                const uniqueThreadIds = [...new Set(slicedMessages.map((message: {id: string, threadId: string})=> message.threadId))];
                let transactionSlicedMessages: GmailThreadMessages[] = []
                const gmailThreadMessages =  uniqueThreadIds.map(async(uniqueThreadId) => {
                    let emails = await gmailClient.getEmailsFromThreads(uniqueThreadId, access_token)
                    const slicedEmails = emails.messages.slice(-threadIdCount.get(uniqueThreadId)).reverse() // [..., latest transaction] (maybe reverse the array)
                    transactionSlicedMessages.push({historyId: emails.historyId, id: emails.id, messages: slicedEmails})
                })
                await Promise.all(gmailThreadMessages)
                const modifiedDummyTransactions = modifyTransactionData(transactionSlicedMessages, user)
                const cachedResult = await redisClient.getKey(`${user.id}:${apiQuery}:transactions`)
                if (!cachedResult){
                    const dbTransactions = await Transaction.findBy(
                        {
                            user_id: user.id,
                            transacted_at: new Date(apiQuery.match(/\\after:(\d{4}\/\d{2}\/\d{2})/)![1])
                        }
                    )
                    const updatedTransactions = [...modifiedDummyTransactions, ...dbTransactions]
                    const userCachedTransactions = await redisClient.setKey(`${user.id}:${apiQuery}:transactions`, JSON.stringify(updatedTransactions), 86400)
                    if (userCachedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
                    const userCachedResultSizeEstimation = await redisClient.setKey(`${user.id}:${apiQuery}:result_size_estimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
                    if (userCachedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
                    return updatedTransactions
                }
                else {
                    const updatedTransactions = [...modifiedDummyTransactions, ...JSON.parse(cachedResult)]
                    const userCachedTransactions = await redisClient.setKey(`${user.id}:${apiQuery}:transactions`, JSON.stringify(updatedTransactions), 86400)
                    if (userCachedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
                    const userCachedResultSizeEstimation = await redisClient.setKey(`${user.id}:${apiQuery}:result_size_estimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
                    if (userCachedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')            
                    return updatedTransactions
                }
            }
        }
    }
    // first time
    if (gmailMessages && gmailMessages.messages && gmailMessages.messages.length > 0){
        console.log("===========FIRST TIME BLOCK")
        const uniqueThreadIds = [...new Set(gmailMessages.messages.map((message: {id: string, threadId: string})=> message.threadId))];
        const gmailThreadMessages = uniqueThreadIds.map((uniqueThreadId) => gmailClient.getEmailsFromThreads(uniqueThreadId, access_token))
        const transactionData = await Promise.all(gmailThreadMessages)
        const modifiedResponse = modifyTransactionData(transactionData, user)
        const userCachedResultSizeEstimation = await redisClient.setKey(`${user.id}:${apiQuery}:result_size_estimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
        if (userCachedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
        const userCachedTransactions = await redisClient.setKey(`${user.id}:${apiQuery}:transactions`, JSON.stringify(modifiedResponse), 86400)
        if (userCachedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
        return modifiedResponse
    }
}



// const getTransactions = async (accessToken: string, apiQuery: string, user: User) => {
//     console.log('getting from gmail api client')
//     // get from cache
//     const resultSize = await redisClient.getKey(`${user.id}:result_size`)
//     if (resultSize){
//         console.log("getting data from cache")
//         const cachedTransactions = await redisClient.getKey(`${user.id}:transactions`)
//         console.log(cachedTransactions, '=======cached')
//         if (cachedTransactions) return JSON.parse(cachedTransactions)
//     }
//     const response = await gmailClient.getMessages(accessToken, apiQuery)
//     console.log(response, '=======messages')
//     // store in redis
//     // set via params received as user can change the filters too.
//     const resultSizeEstimated = await redisClient.setKey(`${user.id}:result_size`, response.resultSizeEstimate.toString(), 86400) // 1 day
//     if (resultSizeEstimated !== "OK") throw new Error('Error in storing resultSizeEstimated in redis')
//     // find unique threadIds
//     if (response.resultSizeEstimate === 0) return []
//     if (response.messages && response.messages.length > 0){

//         const uniqueThreadIds = [...new Set(response.messages.map((message: {id:string, threadId:string})=> message.threadId))];
//         console.log(uniqueThreadIds, '======unique threadids')
//         // get emails from unique threadIds
//         const transactions = uniqueThreadIds.map(async(uniqueThreadId)=> await gmailClient.getEmailsFromThreads(uniqueThreadId, accessToken))
//         console.log(transactions, '======')
//         const transactionData = await Promise.all(transactions)
//         console.log(transactionData,'=====transactiondata')
//         // modify data in the format of transaction model
//         //     1. send directly from gmail api response to client and store it in cache on the basis of params received.
//         // 2. make the response in format of transaction model.
//         // 3. Send the partids grouped by upi too in transaction response. ( not needed, as saving in transaction model already, can update the transaction model when saving from FE )
//         // 4. save these models in transaction model through worker jobs and upi too. (payee in transaction model so save this in upi ) (check if for existing user and for existing upi id there exist a category, if yes then save category id )
//         // 5. user will see all the transactions but cannot filter them by any category nor any upi name. ( only if category id and payeeid is not present )
//         // 6. if user wants to then will have to add the category and upi details.
//         // 7. user clicks on the transaction and popup opens up and user fill out details of category and upi. This will give a message to save other transaction with same upi details.
//         // 8. clicks on save, now all the partIds will be sent and category and upi name that is to be shown and upi id and description., cache will be cleared and set again.
//         // 9. this will save in user_category_upi_mapping, category table and  update transaction models where upi_id is this.
//         // 10. response comes back with category id and upi id.
//         // 11. now user can see upi name and category on the transaction.
//         const modifiedResponse = await modifyTransactionData(transactionData, user)
//         const savedTransactions = await Transaction.save(modifiedResponse)
//         // set in redis
//         const resultSize = await redisClient.setKey(`${user.id}:transactions`, JSON.stringify(savedTransactions), 43200)
//         if (resultSize !== "OK") throw new Error('Error in storing transactions in redis')
//         return transactionData
//     }
// }

export default {
    getTransactions
}