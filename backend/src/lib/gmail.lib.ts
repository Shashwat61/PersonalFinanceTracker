import { GmailMessages } from "../types/transaction.types";
import RequestManager from "./request-manager.lib";

class GmailClient{
    private static _instance: GmailClient;
    private requestManager: RequestManager;
    private constructor(){
        this.requestManager = new RequestManager(process?.env?.GMAIL_API_ENDPOINT_URL!)
    }

    static getInstance(){
        if(!GmailClient._instance){
            GmailClient._instance = new GmailClient();
        }
        return GmailClient._instance
    }
    async getEmails(accessToken: string, query: string){
        console.log('getting emails')
        const response = await this.requestManager.client.get<GmailMessages>(`/me/messages?${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response
    }
}

export const gmailClient = GmailClient.getInstance()