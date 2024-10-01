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
    id?: string
    amount: number
    payee_upi_id: string
    receiver_upi_id: string
    category_id?: string
    bank_account_number: number
    transaction_metadata_id?: string
    transaction_type: string
    user_id?: string
    user_bank_mapping_id?: string
    transacted_at: Date
    created_at: Date
    updated_at: Date
    message_id: string
}