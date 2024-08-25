import { OAuth2Client, TokenPayload } from "google-auth-library";
import { userProfileData } from "../types/auth.types";
import { CookieOptions, Response } from "express";
import { GmailThreadMessages, Message } from "../types/transaction.types";
import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { UserUpiDetails } from "../entity/UserUpiDetails";

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

function modifyTransactionData(transactionData: GmailThreadMessages[], user: User){
    console.log(user, '========user')
    const transactions: Transaction[] = []
    transactionData.forEach((transaction) => {
        transaction.messages.forEach((message, i)=> {
            if (i ==0) console.log(message.snippet)
            transactions.push(parseTransactionMessage(message, user))
        })
    })
    return transactions
}

function parseTransactionMessage(message: Message, user: User) {
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

    const vpaMatch = message.snippet.match(/VPA ([\w@]+)/);
    if (vpaMatch){
        if(transactionInstance.transaction_type === "credit"){
            transactionInstance.payee_upi_id = vpaMatch[1]
            transactionInstance.user = user
        }
        else{
            transactionInstance.receiver_upi_id = vpaMatch[1]
            transactionInstance.user = user
        }
    }


    // Extract the date
    const dateMatch = message.snippet.match(/on (\d{2}-\d{2}-\d{2})/);
    if (dateMatch)
    transactionInstance.transacted_at = getDate(dateMatch[1])

    // Extract the transactionInstance reference number
    // const referenceMatch = message.snippet.match(/reference number is (\d+)/);
    // transactionInstance.referenceNumber = referenceMatch ? referenceMatch[1] : null;

    return transactionInstance;
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
    modifyTransactionData
}