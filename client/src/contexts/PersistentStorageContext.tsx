import {Dispatch, Context, createContext, SetStateAction, useContext, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PersistentStorageValue<T = any> = {
    keyValue: {[key: string]: T} 
    setKeyValue: Dispatch<SetStateAction<{[key: string]: T}>>
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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