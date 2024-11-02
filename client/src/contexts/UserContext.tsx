import useUserData from "@/hooks/useUserData";
import { Context, createContext, useContext } from "react";

type UserContextValue = ReturnType<typeof useUserData> | null

const UserContext: Context<UserContextValue> = createContext<UserContextValue>(null)


export function UserContextProvider({children}: {children: React.ReactNode}){
    const data = useUserData();
    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(){
    const context = useContext(UserContext)
    if(context === null){
        throw new Error("useUserContext must be used within a UserContextProvider")
    }
    return context
}