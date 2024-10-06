import { OAuth2Client, TokenPayload } from "google-auth-library";
import { userProfileData } from "../types/auth.types";
import { CookieOptions, Response } from "express";
import { GmailThreadMessages, Message } from "../types/transaction.types";
import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { UserUpiDetails } from "../entity/UserUpiDetails";
import services from "../services";
import { UserBankMapping } from "../entity/UserBankMapping";
import { Between } from "typeorm";

function oAuth2ClientInstance(){
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
}
async function getAuthenticatedInfo(code:string) {
    const oAuth2Client = oAuth2ClientInstance();
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens)
    oAuth2Client.setCredentials(tokens);
    const tokenIdInfo = await getTokenIdInfo(tokens.id_token!)
    console.log(tokenIdInfo, 'tokeninfo')
    return {oAuth2Client: oAuth2Client, tokens, tokenIdInfo: tokenIdInfo!.getPayload()};
}

async function getAuthenticatedUserDetails(oAuth2Client: OAuth2Client){
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
    const {data}: {data: userProfileData} = await oAuth2Client.request({ url });
    return data
}
const cookieOptions: CookieOptions = {
    // httpOnly: true,
    domain: '',
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === "production"
}
function setCookies(res: Response, id_token: string, tokenIdInfo: TokenPayload){
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const maxAgeInSeconds = (tokenIdInfo.exp - currentTimeInSeconds) * 1000; // 1 hour
    res.cookie('token', id_token, {
        ...cookieOptions,
        maxAge: maxAgeInSeconds
    })
}
async function getTokenInfo(access_token: string){
    const tokenInfo = await oAuth2ClientInstance().getTokenInfo(access_token)
    return tokenInfo
}
async function getTokenIdInfo(token_id: string){
    try {    
        const tokenInfo = await oAuth2ClientInstance().verifyIdToken({
            idToken: token_id,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        return tokenInfo
    } 
    catch (error) {
        
    }
}
function modifyQuery(query: {[key: string]: string}){
    let q = "q=";
    for(const key in query){
        if(query[key]){
            q+=`${key}:${query[key]}`
            q+=`${Object.keys(query).at(Object.keys(query).length -1)== key ? '' : '+'}`
        }
    }
    return q
}

// async function modifyTransactionDataVersionOne(transactionData: GmailThreadMessages[], user: User, apiQuery: {[key: string]: string}, bankId: string){
//     const transactions: Transaction[] = []
//     const {after, before} = apiQuery
//     const userBankMapping = await UserBankMapping.findOne({
//         where: {
//             user_id: user.id,
//             bank_id: bankId
//         }
//     })
//     if(!userBankMapping){
//         throw new Error('User bank mapping not found')
//     }
//     // get transactions of with date after from db
//     const dbSavedTransactions = await Transaction.find({
//         where: {
//             user_id: user.id,
//             user_bank_mapping_id: userBankMapping.id,
//             transacted_at: Between(new Date(after), new Date(before))
//         }
//     })


//     transactionData.map((transaction, i)=>{
//         for(const message of transaction.messages){
//             if (message.snippet){
//                 const foundSavedTransaction = dbSavedTransactions.find(t => t.message_id == message.id)
//                 if(foundSavedTransaction){
//                     transactions.push(foundSavedTransaction)
//                 }
//                 else{
//                     transactions.push(parseTransactionMessage(message, user));
//                 }
//             }
//         }
//     })
//     return transactions
// }

//   function modifyTransactionData(transactionData: GmailThreadMessages[], user: User){
//     console.log(user, '========user')
//     const transactions: Transaction[] = []
//     transactionData.map((transaction) => {
//         for (const message of transaction.messages) {
//             if (message.snippet) {
//                 transactions.push(parseTransactionMessage(message, user));
//             }
//         }
//     });
//     console.log(transactions, '=========transactions returning')
//     return transactions
// }

 function parseTransactionMessage(message: Message, userBankMapping: UserBankMapping){
    // Dear Customer, Rs. 1.00 is successfully credited to your account **8730 by VPA 8802135135@ptaxis on 25-08-24. Your UPI transaction reference number is 4238593610416. Thank you for banking with us. Warm

    // Dear Customer, Rs.1.00 has been debited from account **8730 to VPA 8802135135@ptaxis on 25-08-24. Your UPI transaction reference number is 460404752423. If you did not authorize this transaction,
    const transactionInstance = new Transaction()
    if (message.snippet.includes("credited"))
        transactionInstance.transaction_type = "credit"
    else
        transactionInstance.transaction_type = "debit"

    const amountMatch = message.snippet.match(/Rs\.\s*(\d+(\.\d{1,2})?)/);
    if (amountMatch)
    transactionInstance.amount = parseFloat(amountMatch[1]);

    const accountMatch = message.snippet.match(/account \*\*(\d{4})/);
    if (accountMatch)
    transactionInstance.bank_account_number = parseInt(accountMatch[1])

    const vpaMatch = message.snippet.match(/VPA ([^\s]+)/);
    if (vpaMatch){
        // check if userupidetails is created if not then create
        // const userUpiDetails = await services.userUpiDetailsService.findOrCreate(vpaMatch[1])
        if(transactionInstance.transaction_type === "credit"){
            transactionInstance.payee_upi_id = vpaMatch[1]
            transactionInstance.user_id = userBankMapping.user_id
        }
        else{
            transactionInstance.receiver_upi_id = vpaMatch[1]
            transactionInstance.user_id = userBankMapping.user_id
        }
    }

    const dateMatch = message.snippet.match(/on (\d{2}-\d{2}-\d{2})/);
    if (dateMatch) transactionInstance.transacted_at = getDate(dateMatch[1])
    transactionInstance.message_id = message.id
    transactionInstance.user_bank_mapping_id = userBankMapping.id
    return transactionInstance;
}

 function modifyTransactionDataVersionTwo(transactionData: GmailThreadMessages[], userBankMapping: UserBankMapping){
    const transactions: Transaction[] = []
    transactionData.map(t=> {
        for(const message of t.messages){
            if(message.snippet){
                transactions.push(parseTransactionMessage(message, userBankMapping))
            }
        }
    })
    return transactions
}

function getDate(date:string){
    const dateParts = date.split('-')
    const year = parseInt(dateParts[2]) + 2000
    const month = parseInt(dateParts[1]) - 1
    const day = parseInt(dateParts[0])
    return new Date(year, month, day)
}
export {
    getAuthenticatedInfo,
    getAuthenticatedUserDetails,
    setCookies,
    getTokenInfo,
    getTokenIdInfo,
    oAuth2ClientInstance,
    modifyQuery,
    // modifyTransactionData,
    // modifyTransactionDataVersionOne,
    modifyTransactionDataVersionTwo
}