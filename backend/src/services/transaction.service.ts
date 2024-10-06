import { dbSource } from "../config/dbSource";
import { Bank } from "../entity/Bank";
import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { UserBankMapping } from "../entity/UserBankMapping";
import { gmailClient, redisClient } from "../lib"
import { GmailThreadMessages, Message } from "../types/transaction.types";
import { modifyQuery, modifyTransactionDataVersionTwo } from "../utils/helper";

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
    // console.time("getting gmail message")
    // const gmailMessages = await gmailClient.getMessages(access_token, apiQuery)
    // console.timeEnd("getting gmail message")
    // console.log(apiQuery, '=====params', gmailMessages)
    // if (gmailMessages.resultSizeEstimate === 0) return []
    // console.time("getting gmail cached result")
    // const userCachedResultSizeEstimation = Number(await redisClient.getKey(`${user.id}:${apiQuery}:result_size_estimate`))
    // console.log(userCachedResultSizeEstimation, '=======usercachedresultsize')
    // console.timeEnd("getting gmail cached result")
    // if (userCachedResultSizeEstimation){
    //     if (userCachedResultSizeEstimation === gmailMessages.resultSizeEstimate){
    //         const userCachedTransactions = await redisClient.getKey(`${user.id}:${apiQuery}:transactions`)
    //         if (userCachedTransactions) return JSON.parse(userCachedTransactions)
    //         // get from db
    //         console.log(apiQuery.match(/\\after:(\d{4}\/\d{2}\/\d{2})/)![1], '=====queried date ')
    //         const transactions = await Transaction.findBy({
    //             user_id: user.id,
    //             transacted_at: new Date(apiQuery.match(/\\after:(\d{4}\/\d{2}\/\d{2})/)![1])
    //         })
    //         return transactions
    //     }
    //     else {
    //         // logic for slicing and then responding with messages
    //         const difference = gmailMessages.resultSizeEstimate - userCachedResultSizeEstimation
    //         console.log("=======DIFFERENCE", difference)
    //         if (gmailMessages.messages && gmailMessages.messages.length > 0){
    //             const slicedMessages = gmailMessages.messages.slice(0, difference)
    //             const threadIdCount = new Map()
    //             slicedMessages.forEach(message=> {
    //                 if(threadIdCount.has(message.threadId)){
    //                     threadIdCount.set(message.threadId, threadIdCount.get(message.threadId)+1)
    //                 }
    //                 else {
    //                     threadIdCount.set(message.threadId, 1)
    //                 }
    //             })
    //             const uniqueThreadIds = [...new Set(slicedMessages.map((message: {id: string, threadId: string})=> message.threadId))];
    //             let transactionSlicedMessages: GmailThreadMessages[] = []
    //             const gmailThreadMessages =  uniqueThreadIds.map(async(uniqueThreadId) => {
    //                 let emails = await gmailClient.getEmailsFromThreads(uniqueThreadId, access_token)
    //                 const slicedEmails = emails.messages.slice(-threadIdCount.get(uniqueThreadId)).reverse() // [..., latest transaction] (maybe reverse the array)
    //                 transactionSlicedMessages.push({historyId: emails.historyId, id: emails.id, messages: slicedEmails})
    //             })
    //             await Promise.all(gmailThreadMessages)
    //             const modifiedDummyTransactions = modifyTransactionData(transactionSlicedMessages, user)
    //             const cachedResult = await redisClient.getKey(`${user.id}:${apiQuery}:transactions`)
    //             if (!cachedResult){
    //                 const dbTransactions = await Transaction.findBy(
    //                     {
    //                         user_id: user.id,
    //                         transacted_at: new Date(apiQuery.match(/\\after:(\d{4}\/\d{2}\/\d{2})/)![1])
    //                     }
    //                 )
    //                 const updatedTransactions = [...modifiedDummyTransactions, ...dbTransactions]
    //                 const userCachedTransactions = await redisClient.setKey(`${user.id}:${apiQuery}:transactions`, JSON.stringify(updatedTransactions), 86400)
    //                 if (userCachedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
    //                 const userCachedResultSizeEstimation = await redisClient.setKey(`${user.id}:${apiQuery}:result_size_estimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
    //                 if (userCachedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
    //                 return updatedTransactions
    //             }
    //             else {
    //                 const updatedTransactions = [...modifiedDummyTransactions, ...JSON.parse(cachedResult)]
    //                 const userCachedTransactions = await redisClient.setKey(`${user.id}:${apiQuery}:transactions`, JSON.stringify(updatedTransactions), 86400)
    //                 if (userCachedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
    //                 const userCachedResultSizeEstimation = await redisClient.setKey(`${user.id}:${apiQuery}:result_size_estimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
    //                 if (userCachedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')            
    //                 return updatedTransactions
    //             }
    //         }
    //     }
    // }
    // // first time
    // if (gmailMessages && gmailMessages.messages && gmailMessages.messages.length > 0){
    //     console.log("===========FIRST TIME BLOCK")
    //     const uniqueThreadIds = [...new Set(gmailMessages.messages.map((message: {id: string, threadId: string})=> message.threadId))];
    //     const gmailThreadMessages = uniqueThreadIds.map((uniqueThreadId) => gmailClient.getEmailsFromThreads(uniqueThreadId, access_token))
    //     const transactionData = await Promise.all(gmailThreadMessages)
    //     const modifiedResponse = modifyTransactionData(transactionData, user)
    //     const userCachedResultSizeEstimation = await redisClient.setKey(`${user.id}:${apiQuery}:result_size_estimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
    //     if (userCachedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
    //     const userCachedTransactions = await redisClient.setKey(`${user.id}:${apiQuery}:transactions`, JSON.stringify(modifiedResponse), 86400)
    //     if (userCachedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
    //     return modifiedResponse
    // }
}


const getTransactionsVersionOne = async(access_token: string, apiQuery: {[key:string]: string}, user: User)=>{
    // const {bankId} = apiQuery
    // delete apiQuery.bankId
    // const modifiedQuery = modifyQuery(apiQuery)
    // const gmailMessages = await gmailClient.getMessages(access_token, modifiedQuery);
    // if (gmailMessages.resultSizeEstimate === 0) return []
    // const userCachedResultSizeEstimation = await redisClient.getKey(`${user.id}_resultSizeEstimate`)
    // if (userCachedResultSizeEstimation){
    //     if ((Number(userCachedResultSizeEstimation) < gmailMessages.resultSizeEstimate) && gmailMessages.messages){
    //         const difference = gmailMessages.resultSizeEstimate - Number(userCachedResultSizeEstimation)
    //         const slicedMessages = gmailMessages.messages.slice(0, difference)
    //         const uniqueThreadIds = [...new Set(slicedMessages.map(msg => msg.threadId))]
    //         const threadIdCount = new Map()
    //         slicedMessages.forEach(message=> {
    //             if(threadIdCount.has(message.threadId)){
    //                 threadIdCount.set(message.threadId, threadIdCount.get(message.threadId)+1)
    //             }
    //             else {
    //                 threadIdCount.set(message.threadId, 1)
    //             }
    //         })
    //         const userCachedTransactions = await redisClient.getKey(`${user.id}_${modifiedQuery}`)
    //         if (userCachedTransactions){
    //             const slicedThreadMessages: GmailThreadMessages[] = []
    //             const gmailThreadMessages = uniqueThreadIds.map(async threadId => {
    //                 const messages = await gmailClient.getEmailsFromThreads(threadId, access_token)
    //                 const slicedMessages = messages.messages.slice(-threadIdCount.get(threadId)).reverse()
    //                 slicedThreadMessages.push({historyId: messages.historyId, id: messages.id, messages: slicedMessages})
    //             })
    //             await Promise.all(gmailThreadMessages)
    //             const modifiedDummyTransactions = await modifyTransactionDataVersionOne(slicedThreadMessages, user, apiQuery, bankId)
    //             const updatedTransactions = [...modifiedDummyTransactions, ...JSON.parse(userCachedTransactions)]
    //             const stored = await redisClient.setKey(`${user.id}_${modifiedQuery}`, JSON.stringify(updatedTransactions), 86400)
    //             if (stored !== "OK") throw new Error('Error in storing transactions in redis')
    //             const storedResultSizeEstimation = await redisClient.setKey(`${user.id}_resultSizeEstimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
    //             if (storedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
    //             return updatedTransactions
    //         }
    //         else {
    //             const gmailThreadMessages = uniqueThreadIds.map(threadId => gmailClient.getEmailsFromThreads(threadId, access_token))
    //             const transactionData = await Promise.all(gmailThreadMessages)
    //             const modifiedResponse  = await modifyTransactionDataVersionOne(transactionData, user, apiQuery, bankId)
    //             const stored = await redisClient.setKey(`${user.id}_${modifiedQuery}`, JSON.stringify(modifiedResponse), 86400)
    //             if (stored !== "OK") throw new Error('Error in storing transactions in redis')
    //             const storedResultSizeEstimation = await redisClient.setKey(`${user.id}_resultSizeEstimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
    //             if (storedResultSizeEstimation !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
    //             return modifiedResponse;
    //         }
    //     }
    // }
    // else{

    //     const stored = await redisClient.setKey(`${user.id}_resultSizeEstimate`, gmailMessages.resultSizeEstimate.toString(), 86400)
    //     if (stored !== "OK") throw new Error('Error in storing resultSizeEstimation in redis')
    //     // finding unique threadIds from response
    //     const uniqueThreadIds = [...new Set(gmailMessages.messages?.map(message => message.threadId))]
    //     const gmailThreadMessages = uniqueThreadIds.map(threadId => gmailClient.getEmailsFromThreads(threadId, access_token))
    //     const transactionData = await Promise.all(gmailThreadMessages)
    //     const modifiedResponse  = await modifyTransactionDataVersionOne(transactionData, user, apiQuery, bankId)
    //     const storedTransactions = await redisClient.setKey(`${user.id}_${modifiedQuery}`, JSON.stringify(modifiedResponse), 86400)
    //     if (storedTransactions !== "OK") throw new Error('Error in storing transactions in redis')
    //     return modifiedResponse;
    // }
}

const getTransactionsVersionTwo = async(
    access_token: string, apiQuery: {[key:string]: string}, user: User
) => {
    const {bankId} = apiQuery // TODO: take it as hashed value and unhash it here
    delete apiQuery.bankId
    const modifiedQuery = modifyQuery(apiQuery)
    let currentDayLastTransaction = null
    const userBankLastCachedTransactionId = await redisClient.getKey(`${user.id}_${bankId}_last_transaction`)
    const userBankMapping = await UserBankMapping.findOneBy({user_id: user.id, bank_id: bankId})
    if (!userBankMapping) throw new Error('User bank mapping not found')
    if (userBankLastCachedTransactionId){
        currentDayLastTransaction = await Transaction.findOneBy({id: userBankLastCachedTransactionId})
    }
    else {
        currentDayLastTransaction = await dbSource.manager
        .createQueryBuilder(Transaction, "t")
        .leftJoinAndSelect('t.userBankMapping', 'ubm')
        .where('ubm.user_id = :userId', { userId: user.id })
        .andWhere('ubm.bank_id = :bankId', { bankId })
        .orderBy('t.created_at', 'DESC')
        .getOne();
    }
    return await setGmailMessages(modifiedQuery, access_token, userBankMapping, currentDayLastTransaction)

    
}


async function setGmailMessages(modifiedQuery: string, access_token: string, userBankMapping: UserBankMapping, lastTransaction: Transaction | null){
    const {messages, resultSizeEstimate} = await gmailClient.getMessages(access_token, modifiedQuery)
    if (!messages && resultSizeEstimate === 0) return []
    if (!lastTransaction){
        // which means either cache value was not found or there is no transaction done for the current day
        // which means get all the messages and iterate over all of'em.
        const uniqueThreadIds = [...new Set(messages?.map(msg => msg.threadId))]
        const gmailThreadMessages = uniqueThreadIds.map(threadId => gmailClient.getEmailsFromThreads(threadId, access_token))
        const transactionData = await Promise.all(gmailThreadMessages)
        const modifiedResponse = modifyTransactionDataVersionTwo(transactionData, userBankMapping)
        let sortedOrder: Transaction[] = []
        // sort modifiedresponse with reverse order of messages 
        messages?.reverse().forEach(msg => {
            const foundTransaction = modifiedResponse.find(t => t.message_id === msg.id)
            if (foundTransaction){
                sortedOrder.push(foundTransaction)
            }
        })
        // save the last transaction in redis
        const savedTransactions = await Transaction.save(sortedOrder)
        const lastTransaction = savedTransactions[savedTransactions.length - 1]
        await redisClient.setKey(`${userBankMapping.user_id}_${userBankMapping.bank_id}_last_transaction`, lastTransaction.id.toString(), 86400)
        return savedTransactions
    }
    else if (messages && (lastTransaction.message_id == messages[0].id)){
        // no new transactions have occured, get the latest 10 transactions
        // get the latest transactions if no tracker id found from fe
        // in case of loading new transactions, if no new transaction is to be found, in db then send []
        if (!trackerId){
            const transactions = await Transaction.find({
                where: {
                    user_id: userBankMapping.user_id,
                    user_bank_mapping_id: userBankMapping.id
                },
                order: {
                    created_at: 'DESC'
                },
                take: 10
            })
        }

    }

}


export default {
    getTransactions,
    getTransactionsVersionOne,
    getTransactionsVersionTwo
}