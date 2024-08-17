import { getMails } from "../api/gmail.api";

class GmailClient{
    private static _instance: GmailClient;
    private constructor(){}

    static getInstance(){
        if(!GmailClient._instance){
            GmailClient._instance = new GmailClient();
        }
        return GmailClient._instance
    }
    async getEmails(accessToken: string){
        console.log('getting emails')
        const response = await getMails(accessToken)
        return response
    }
}

export const gmailClient = GmailClient.getInstance()