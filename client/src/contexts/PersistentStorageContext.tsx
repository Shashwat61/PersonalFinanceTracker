import useBankData from "@/hooks/useBankData";
import {Dispatch, Context, ContextType, createContext, SetStateAction, useContext, useState } from "react";
import usePersistentStorage from "@/hooks/usePersistentStorage";

type PersistentStorageValue<T = any> = {
    keyValue: {[key: string]: T} 
    setKeyValue: Dispatch<SetStateAction<{[key: string]: T}>>
}
const PersistentStorageContext: Context<PersistentStorageValue>  = createContext<PersistentStorageValue<any>>({
    keyValue: {},
    setKeyValue: ()=>{}
})

export function PersistentStorageProvider({children}: {children: React.ReactNode}) {
    const [keyValue, setKeyValue] = useState<{[key:string]: string}>({})
    return (
        <PersistentStorageContext.Provider value={{keyValue, setKeyValue}}>
            {children}
        </PersistentStorageContext.Provider>
    )
}

export function usePersistentStorageContext<T>(){
    const context = useContext(PersistentStorageContext)
    return context as PersistentStorageValue<T>
}