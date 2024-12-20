import {
  GmailMessages,
  GmailThreadMessages,
} from '@custom-types/transaction.types';
import RequestManager from './request-manager.lib';

class GmailClient {
  private static _instance: GmailClient;
  private requestManager: RequestManager;
  private _limit = 50; // fixed this as this would mean less gmail api calls
  private constructor() {
    this.requestManager = new RequestManager(
      process.env.GMAIL_API_ENDPOINT_URL as string,
    );
  }

  static getInstance() {
    if (!GmailClient._instance) {
      GmailClient._instance = new GmailClient();
    }
    return GmailClient._instance;
  }
  async getMessages(accessToken: string, query: string, pageToken?: string) {
    console.log('getting emails');
    const queries = pageToken
      ? `maxResults=${this._limit}&${query}&pageToken=${pageToken}`
      : `maxResults=${this._limit}&${query}`;
    const response = await this.requestManager.client.get<GmailMessages>(
      `/me/messages?${queries}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  }

  async getEmailsFromThreads(threadId: string, accessToken: string) {
    const response = await this.requestManager.client.get<GmailThreadMessages>(
      `/me/threads/${threadId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  }
}

export const gmailClient = GmailClient.getInstance();
