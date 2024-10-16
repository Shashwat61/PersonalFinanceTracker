import { Bank, DefaultGetManyParams, EditTransaction, Transaction, TransactionResponse } from '@/types'
import { getDates } from '@/utils'
import { getMany, updateMany } from '@/utils/api'
import { QUERY_STALE_TIME, TRANSACTION_RESPONSE_LIMIT } from '@/utils/constants'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


function useTransactions(userId:string | undefined, primaryUserBank: Bank | null, selectedDate:Date) {
    console.log(selectedDate, 'in usetransaction')
    const queryClient = useQueryClient()

    const {data: userTransactions, isLoading: userTransactionsLoading, isSuccess: userTransactionsSuccess, } = useInfiniteQuery({
        queryKey: ["transactions", userId, primaryUserBank?.id, selectedDate],
        queryFn: () => getMany<TransactionResponse, DefaultGetManyParams>(`/transactions/v2`, {
            filters: {
                from: primaryUserBank!.listener_email!,
                limit: TRANSACTION_RESPONSE_LIMIT
            },
            dates: {
                ...getDates(selectedDate)
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


    const {mutate: updateTransactions, isSuccess: updateTransactionsSuccess, isPending: updateTransactionsPending, data: updatedTransactions, variables} = useMutation({
        mutationFn: (data: EditTransaction) => updateMany<Transaction[], EditTransaction>('/transactions', data),
        onMutate: async (data) => {
            console.log(data, 'data in onMutate')
        },
        onSettled: async(data, variables, context) => {
            console.log(data, 'data in onSuccess')
            return await queryClient.invalidateQueries({
                queryKey: ["transactions", userId, primaryUserBank?.id, selectedDate]
            })
        }
    })
  return {
        userTransactions: transactions,
        userTransactionsLoading,
        userTransactionsSuccess,
        updateTransactions,
        updateTransactionsSuccess,
        updateTransactionsPending,
        updatedTransactions,
        variables
  }
}

export default useTransactions