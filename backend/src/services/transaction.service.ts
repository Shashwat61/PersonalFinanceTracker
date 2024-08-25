import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { gmailClient } from "../lib"
import { modifyTransactionData } from "../utils/helper";


const getTransactions = async (accessToken: string, apiQuery: string, user: User) => {
    console.log('getting from gmail api client')
    const response = await gmailClient.getMessages(accessToken, apiQuery)
    // find unique threadIds
    console.log(response, '=========messages')
    if (response.resultSizeEstimated === 0) return []
    if (response.messages && response.messages.length > 0){

        const uniqueThreadIds = [...new Set(response.messages.map((message: {id:string, threadId:string})=> message.threadId))];
        console.log(uniqueThreadIds, '======unique threadids')
        // get emails from unique threadIds
        const transactions = uniqueThreadIds.map(async(uniqueThreadId)=> await gmailClient.getEmailsFromThreads(uniqueThreadId, accessToken))
        console.log(transactions, '======')
        const transactionData = await Promise.all(transactions)
        console.log(transactionData,'=====transactiondata')
        // modify data in the format of transaction model
        //     1. send directly from gmail api response to client and store it in cache on the basis of params received.
        // 2. make the response in format of transaction model.
        // 3. Send the partids grouped by upi too in transaction response. ( not needed, as saving in transaction model already, can update the transaction model when saving from FE )
        // 4. save these models in transaction model through worker jobs and upi too. (payee in transaction model so save this in upi ) (check if for existing user and for existing upi id there exist a category, if yes then save category id )
        // 5. user will see all the transactions but cannot filter them by any category nor any upi name. ( only if category id and payeeid is not present )
        // 6. if user wants to then will have to add the category and upi details.
        // 7. user clicks on the transaction and popup opens up and user fill out details of category and upi. This will give a message to save other transaction with same upi details.
        // 8. clicks on save, now all the partIds will be sent and category and upi name that is to be shown and upi id and description., cache will be cleared and set again.
        // 9. this will save in user_category_upi_mapping, category table and  update transaction models where upi_id is this.
        // 10. response comes back with category id and upi id.
        // 11. now user can see upi name and category on the transaction.
        const modifiedResponse = modifyTransactionData(transactionData, user)
        console.log(modifiedResponse[0], '======modified response got')
        const entity = await Transaction.save(modifiedResponse[0])
        console.log(entity, '=====modified entity')
        
        return transactionData
    }
}

export default {
    getTransactions
}