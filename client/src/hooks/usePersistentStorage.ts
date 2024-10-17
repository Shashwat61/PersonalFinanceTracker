import { usePersistentStorageContext } from "@/contexts/PersistentStorageContext"
import { useEffect } from "react"

type PersistentStorage<T> = {
    keyName: string
    getFromLocalStorage: boolean
    initialValue: T
}
function usePersistentStorage<T>({keyName, getFromLocalStorage, initialValue}: PersistentStorage<T>): [T, (val: T) => void]{
    const {keyValue, setKeyValue} = usePersistentStorageContext<T>()
    console.log(keyValue, keyName, getFromLocalStorage, 'props')

    function handleSetKeyValue(value: T){
        setKeyValue(prev => ({...prev, [keyName]: value}))
        localStorage.setItem(keyName, JSON.stringify(value))
    }

    useEffect(()=>{
        if (!keyValue[keyName]){
            if(getFromLocalStorage){
                const value = localStorage.getItem(keyName)
                if(value){
                    setKeyValue(prev => ({...prev, [keyName]: JSON.parse(value)}))
                }
                else{
                    setKeyValue(prev => ({...prev, [keyName]: initialValue}))
                    localStorage.setItem(keyName, JSON.stringify(initialValue))
                }
            }
            else{
                setKeyValue(prev => ({...prev, [keyName]: initialValue}))
            }
        }
    },[])

    return [
        keyValue[keyName] as T ,
        handleSetKeyValue
    ]
}

export default usePersistentStorage