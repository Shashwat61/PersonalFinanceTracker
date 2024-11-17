import  { useCallback, useEffect } from 'react'
function useThrottledEvent(eventName:string, target: HTMLDivElement | null, interval: number, callbackFn: ()=> void, fetchingMore?: boolean ): void {
    
    const throttledCallback = useCallback(throttle(callbackFn, interval), [callbackFn, fetchingMore])

    useEffect(()=>{
        console.log('WTF is going on!')
        if (target){
            target.addEventListener(eventName, throttledCallback)
            return () => target.removeEventListener(eventName, throttledCallback)
        }
    },[target, fetchingMore, throttledCallback])
}

function throttle(callbackFn: () => void, interval: number){
    let fireEvent = true
    return function(){
        if(!fireEvent) return
        else{
            callbackFn()
            fireEvent = false
            setTimeout(()=>{
                fireEvent = true
            }, interval)
        }
    }
}


export default useThrottledEvent