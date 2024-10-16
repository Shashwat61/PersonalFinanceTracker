export interface GmailMessages {
    resultSizeEstimate: number;
    messages?: GmailMessage[]
    nextPageToken?: string;
}

export interface GmailMessage {
    id: string;
    threadId: string;
}

export interface GmailThreadMessages{
    id: string;
    historyId: string;
    messages: Message[]
}

export interface Message{
    internalDate: string
    historyId:string
    id:string
    snippet:string
    threadId:string
    labelIds: string[]
    payload: Payload
}

  
  interface Payload {
    mimeType: string;
    body: Body;
    partId: string;
    filename: string;
    headers: Header[];
    parts?: Part[]; // optional, in case it's not always present
  }
  
  interface Body {
    size: number;
    data?: string; // optional, as it seems it might not always be present
  }
  
  interface Header {
    name: string;
    value: string;
  }
  
  interface Part {
    mimeType: string;
    headers: Header[];
    body: Body;
  }


  export interface TransactionParams{
    after: string,
    before: string,
    from: string,
    trackedId?: string | undefined,
    limit: string
  }

  export type UpdateTransactionRequestBody = {
    transactionIds: string[],
    categoryId?: string,
    vpaName?: string
  }