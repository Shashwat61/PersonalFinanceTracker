import React, { useEffect } from 'react'

function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
    useEffect(()=>{
        const timeOut = setTimeout(()=> {
            setDebouncedValue(value)
        },delay)
        return () => {
            clearTimeout(timeOut)
        }
    },[value])
    
  return [debouncedValue]
}

export default useDebounce