import { In, LessThan, MoreThan } from "typeorm";
import { dbSource } from "../config/dbSource";
import { Bank } from "../entity/Bank";
import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { UserBankMapping } from "../entity/UserBankMapping";
import { gmailClient, redisClient } from "../lib"
import { GmailMessage, GmailMessages, GmailThreadMessages, Message, TransactionParams } from "../types/transaction.types";
import { modifyQuery, modifyTransactionDataVersionTwo } from "../utils/helper";
import { UserUpiDetails } from "../entity/UserUpiDetails";
import { UserUpiCategoryNameMapping } from "../entity/UserUpiCategoryNameMapping";



const getTransactionsVersionTwo = async(
    access_token: string, apiQuery: TransactionParams, bankId:string, user: User
) => {
    const {trackedId, limit} = apiQuery // TODO: take it as hashed value and unhash it here
    
    const query = Object.assign({},{
        from: apiQuery.from,
        after: apiQuery.after,
        before: apiQuery.before
    })
    const modifiedQuery = modifyQuery(query)
    let currentDayLastTransaction = null
    const userBankLastCachedTransactionId = await redisClient.getKey(`${user.id}_${bankId}_last_transaction`)
    const userBankMapping = await UserBankMapping.findOneBy({user_id: user.id, bank_id: bankId})
    if (!userBankMapping) throw new Error('User bank mapping not found')
    if (userBankLastCachedTransactionId){
        currentDayLastTransaction = await Transaction.findOneBy({message_id: userBankLastCachedTransactionId})
    }
    else {
        currentDayLastTransaction = await dbSource.manager
        .createQueryBuilder(Transaction, "t")
        .leftJoinAndSelect('t.userBankMapping', 'ubm')
        .where('ubm.user_id = :userId', { userId: user.id })
        .andWhere('ubm.bank_id = :bankId', { bankId })
        .andWhere('t.created_at >= :after', { after: apiQuery.after })
        .andWhere('t.created_at <= :before', { before: apiQuery.before })
        .orderBy('t.created_at', 'DESC')
        .getOne();
    }
    const transactions =  await setGmailMessages(modifiedQuery, access_token, userBankMapping, currentDayLastTransaction, trackedId, Number(limit))
    return {transactions, cursor: transactions[transactions.length-1]}
}

async function setGmailMessages(modifiedQuery: string, access_token: string, userBankMapping: UserBankMapping, lastTransaction: Transaction | null, trackedId: string | undefined, limit: number){
    const messages = await getGmailMessages(access_token, modifiedQuery, lastTransaction)
    if (!messages.length && !lastTransaction) return []
    if (lastTransaction && !messages.length){

       // messages [] -> no new messages
       // if trackedId -> user is loading for more
       // if no trackedId -> user is loading for first time
        let transactions: Transaction[] = []
        if (!trackedId){
             transactions = await Transaction.find({
                // relations: ["userUpiDetails"],
                where: {
                    user_bank_mapping_id: userBankMapping.id
                },
                order: {
                    sequence: 'DESC'
                },
                take: limit
            })   
        }
        else{
             transactions = await Transaction.find({
                where:{
                    user_bank_mapping_id: userBankMapping.id,
                    sequence: LessThan(lastTransaction.sequence)
                },
                loadRelationIds: {
                    relations: ['category'],
                },
                take: limit
            })
            await redisClient.setKey(
                `${userBankMapping.user_id}_${userBankMapping.bank_id}_last_transaction`,
                transactions[transactions.length - 1].message_id.toString(),
                86400
            )
        }
        return transactions
    }
    // which means either cache value was not found or there is no transaction done for the current day
    // which means get all the messages and iterate over all of'em.
    const savedTransactions = await modifyAndSaveTransactions(messages, access_token, userBankMapping, lastTransaction)
    // save and implement tracker
    const lastSavedTransaction = savedTransactions[savedTransactions.length - 1]
    await redisClient.setKey(`${userBankMapping.user_id}_${userBankMapping.bank_id}_last_transaction`, lastSavedTransaction.message_id.toString(), 86400)
    // if trackedId is present then return the transactions 10 conditions

    return savedTransactions
}

async function modifyAndSaveTransactions(messages: GmailMessage[], access_token: string, userBankMapping: UserBankMapping, lastTransaction: Transaction | null){
    let sortedOrder: Transaction[] = [], lastTransactionSequence = lastTransaction?.sequence || 0
    const uniqueThreadIds = [...new Set(messages?.map(msg => msg.threadId))]
        const gmailThreadMessages = uniqueThreadIds.map(threadId => gmailClient.getEmailsFromThreads(threadId, access_token))
        const transactionData = await Promise.all(gmailThreadMessages)
        const [modifiedResponse, userUpiDetails] = modifyTransactionDataVersionTwo(transactionData, userBankMapping)
        // sort modifiedresponse with reverse order of messages 
        messages?.reverse().forEach(msg => {
            const foundTransaction = modifiedResponse.find(t => t.message_id === msg.id)
            if (foundTransaction){
                foundTransaction.sequence=++lastTransactionSequence
                sortedOrder.push(foundTransaction)
            }
        })
        // findorcreate  userupidetails bulk
        const dbUserUpiDetails = await UserUpiDetails.find({
            where:{
                upi_id: In(userUpiDetails)
            },
            select: ['upi_id']
        })
        
         const toSaveUpiIds = userUpiDetails
         .filter(upiId => !dbUserUpiDetails.some(dbUpiId => dbUpiId.upi_id === upiId))
         .map(upiId => ({ upi_id: upiId! }));
        // also save in userupicategorynamemapping table
        // whenever a new upi id comes, it will be saved
        if (toSaveUpiIds.length > 0) {
            await UserUpiDetails.insert(toSaveUpiIds);
            const userUpiCategoryNameMappingList = toSaveUpiIds.map((upiId)=> {
                const userUpiCategoryNameMappingInstance = new UserUpiCategoryNameMapping()
                userUpiCategoryNameMappingInstance.upi_id = upiId.upi_id
                userUpiCategoryNameMappingInstance.user_id = userBankMapping.user_id
                return userUpiCategoryNameMappingInstance
            }
            )
            await UserUpiCategoryNameMapping.save(userUpiCategoryNameMappingList)
        }


        // save the last transaction in redis
        const savedTransactions = await Transaction.save(sortedOrder, {
            reload: true,
        })
        const loadedTransactions = await Transaction.find({
            relations: ["userUpiDetails"],
            where:{
                id: In(savedTransactions.map(item => item.id))
            }
        })
        return loadedTransactions
}

async function getGmailMessages(access_token:string, modifiedQuery: string, lastTransaction: Transaction | null): Promise<GmailMessage[]>{
    const messages: GmailMessage[]= []
    const gmailMessages = await gmailClient.getMessages(access_token, modifiedQuery)
    if (gmailMessages.resultSizeEstimate === 0 && gmailMessages.messages?.length ==0) return messages
    if (gmailMessages.resultSizeEstimate > 0){
        for(const [index, msg] of gmailMessages.messages!.entries()){
            if (lastTransaction && lastTransaction.message_id === msg.id) break;
            messages.push(msg)
            if (index==messages.length-1 && gmailMessages.nextPageToken){
                const recursiveMessages = await getGmailMessages(access_token, modifiedQuery, lastTransaction)
                messages.push(...recursiveMessages)
            }       
        }
    }
    return messages
}


export default {
    getTransactionsVersionTwo
}