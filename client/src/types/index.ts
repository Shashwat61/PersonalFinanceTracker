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