import { Transaction, TransactionResponse } from '@/types'
import React, { MutableRefObject, ReactNode, useEffect, useRef } from 'react'
import TransactionSlab from './TransactionSlab'
import useThrottledEvent from '@/hooks/useThrottledEvent'
import { InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
interface TransactionSlabsContainerProps{
    transactions: Transaction[] | null
    handleEditTransaction: (transaction: Transaction) => void
    updateTransactionsPending: boolean
    similarTransactionsIds: string[]
    updateTransactionsSuccess: boolean
    fetchingMoreTransactions: boolean
    fetchMoreTransactions: () => Promise<InfiniteQueryObserverResult<InfiniteData<TransactionResponse, unknown>, Error>>
    hasMore: boolean
}
function TransactionSlabsContainer({transactions, handleEditTransaction, updateTransactionsPending, similarTransactionsIds, updateTransactionsSuccess, fetchMoreTransactions, fetchingMoreTransactions, hasMore}: TransactionSlabsContainerProps) {
    const transactionContainerRef = useRef<HTMLDivElement>(null)
    const fetchNextTransactionsRef = useRef<HTMLDivElement>(null)
    const refreshCallbackFn = fetchingMoreTransactions || hasMore
    useThrottledEvent("scroll", transactionContainerRef.current, 100, checkIfLastElementInView, refreshCallbackFn)


    function checkIfLastElementInView(){
        const tranasctionContinerRect = transactionContainerRef.current?.getBoundingClientRect()
        const fetchNextTransactionsRect = fetchNextTransactionsRef.current?.getBoundingClientRect()
        if(tranasctionContinerRect?.bottom && fetchNextTransactionsRect?.top){
            // dont execute if nextransactions are being fetched
            // maybe have to add dependency of loadingtransactions in usethrottle
            console.log(tranasctionContinerRect?.bottom, fetchNextTransactionsRect?.top, fetchingMoreTransactions, hasMore )
            if(fetchNextTransactionsRect.top <= tranasctionContinerRect.bottom && !fetchingMoreTransactions && hasMore){
                console.log('fetching next tranasctions', fetchingMoreTransactions, hasMore)
                fetchMoreTransactions()
            }
        }
        return
    }
  return (
    <div className="overflow-scroll h-[50vh]  space-y-4" ref={transactionContainerRef}>
              {
                transactions && transactions?.length > 0 && (

                    <>
                {transactions?.map((transaction) => (
                    <TransactionSlab 
                    key={transaction.id} 
                    transaction={transaction} 
                    onEdit={handleEditTransaction}
                    updateMutationPending={updateTransactionsPending}
                    similarTransactionsIds = {similarTransactionsIds}
                    updateMutationSuccess = {updateTransactionsSuccess}
                    />
                ))
            }
                <div className="p-4" ref={fetchNextTransactionsRef}>
                    {fetchingMoreTransactions && (
                        <Loader className="w-8 h-8 animate-spin text-primary"/>
                    )}
                </div>
            </>
        )
            }
                
        {!transactions?.length ? <div className=" justify-self-center text-muted-foreground">No new transactions</div> : null}
    </div>
  )
}

export default TransactionSlabsContainer