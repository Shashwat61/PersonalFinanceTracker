export interface User{
    id: string
    name: string
    email: string
    created_at: Date
    updated_at: Date
    banks?: Bank[]
}

export interface Bank{
    id: string
    name: string
    listener_email: string | null
    created_at: Date
    updated_at: Date
}

export interface Transaction{
    id: string
    amount: number
    bank_account_number?: number
    transaction_metadata_id?: string
    transaction_type: string
    user_id: string
    user_bank_mapping_id: string
    transacted_at: string
    created_at: string
    updated_at: string
    message_id: string
    sequence: number
    user_upi_category_name_mapping_id: string
    userUpiCategoryNameMapping: UserUpiCategoryNameMapping
}
export interface TransactionResponse{
    transactions: Transaction[]
    nextCursor: string
}
export type DefaultGetManyParams = {
    filters?: Filter;
    // sort?: Sort;
    dates?: DateRangeValue;
    id?: string;
  };

export type Filter = {
    from: string
    limit: number
}

export type DateRangeValue = {
    after: string
    before: string
}

export type Category = {
    id: string
    name: string
    created_at: Date
    updated_at: Date
}

export type EditTransaction = {
    transactionIds: string[]
    categoryId?: string
    vpaName?: string
}

export interface UserUpiCategoryNameMapping {
    id: string
    user_id: string
    upi_id: string
    category_id: string
    upi_name: string
    created_at: Date
    updated_at: Date
    category?: Category
}