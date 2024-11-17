import useBankData from "@/hooks/useBankData";
import { Context, createContext, useContext } from "react";
import { useUserContext } from "./UserContext";

type BankContextValue = ReturnType<typeof useBankData> | null;
const BankContext: Context<BankContextValue>  = createContext<BankContextValue>(null)

export function BankContextProvider({children}: {children: React.ReactNode}) {
    const userData = useUserContext()
    const data = useBankData(userData.userBanks.length > 0)
    return (
        <BankContext.Provider value={data}>
            {children}
        </BankContext.Provider>
    )
}

export function useBankContext(){
    const context = useContext(BankContext)
    if(context === null){
        throw new Error("useBankContext must be used within a BankContextProvider")
    }
    return context
}