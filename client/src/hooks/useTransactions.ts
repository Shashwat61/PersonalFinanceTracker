import { Bank, DefaultGetManyParams, Transaction, TransactionResponse } from '@/types'
import { getMany } from '@/utils/api'
import { QUERY_STALE_TIME, TRANSACTION_RESPONSE_LIMIT } from '@/utils/constants'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'


function useTransactions(userId:string | undefined, primaryUserBank: Bank, selectedDate:Date) {

    const {data: userTransactions, isLoading: userTransactionsLoading, isSuccess: userTransactionsSuccess, } = useInfiniteQuery({
        queryKey: ["transactions", userId, primaryUserBank?.id, selectedDate],
        // after=2024-10-06&before=2024-10-07&bankId=${primaryUserBank?.id}&from=${primaryUserBank?.listener_email}&limit=${10}
        queryFn: () => getMany<TransactionResponse, DefaultGetManyParams>(`/transactions/v2`, {
            filters: {
                from: primaryUserBank!.listener_email!,
                limit: TRANSACTION_RESPONSE_LIMIT
            },
            dates: {
                after: selectedDate.toISOString(),
                before: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            },
            id: primaryUserBank!.id,
        }),
        enabled: !!userId && !!primaryUserBank?.listener_email,
        retry: false,
        staleTime: QUERY_STALE_TIME,
        initialPageParam: '0',
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor
    })
    const transactions: Transaction[] = []
    if (userTransactions){
        console.log(userTransactions, 'userTransactions')
        userTransactions.pages.forEach((item: TransactionResponse,i)=>{
            if (item.transactions){
                transactions.push(...item.transactions)
            }
        })
    }
    console.log(transactions, 'transactions... ')
  return {
        userTransactions: transactions,
        userTransactionsLoading,
        userTransactionsSuccess
  }
}

export default useTransactions