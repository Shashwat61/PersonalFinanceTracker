export interface GmailMessages {
    resultSizeEstimated: number;
    messages: {
        id: string,
        threadId: string
    }[]
    nextPageToken?: string;
}