
import { LucideProps } from "lucide-react"

export interface User{
    id: string
    name: string
    email: string
    created_at: Date
    updated_at: Date
    userBankMappings: UserBankMapping[] | []
}

export interface UserBankMapping{
    id: string
    user_id: string
    bank_id: string
    created_at: Date
    updated_at: Date
    account_number: string
    bank: Bank
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
    bank_account_number: string
    transaction_metadata_id: string | null
    transaction_type: string
    user_id: string
    user_bank_mapping_id: string
    transacted_at: string
    created_at: string
    updated_at: string
    message_id: string | null
    sequence: number
    user_upi_category_name_mapping_id: string | null
    userUpiCategoryNameMapping?: UserUpiCategoryNameMapping
    mode: string
}

export interface AddTransaction extends Omit<Partial<Transaction>, 'userUpiCategoryNameMapping'>{
    bank_account_number: string
    mode: string
    transaction_metadata_id?: string
    transacted_at: string
    amount: number
    transaction_type: string
    user_bank_mapping_id: string
    category_id: string
}
export interface TransactionResponse{
    transactions: Transaction[]
    cursor: number | null
}
export type DefaultGetManyParams = {
    filters?: Filter;
    // sort?: Sort;
    dates?: DateRangeValue;
    id?: string;
    cursor?: number
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
    id?: string
    user_id?: string
    upi_id?: string
    category_id?: string
    upi_name?: string
    created_at?: string
    updated_at?: string
    category?: Category
}

export type SideBarItem = {
    id: number
    redirectLink: string
    name: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}


export type AddUserBank = {
    userId: string;
    bankId: string
    accountNumber: string
}