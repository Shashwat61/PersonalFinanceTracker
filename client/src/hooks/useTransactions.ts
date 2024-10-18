import { Bank, Category, DefaultGetManyParams, EditTransaction, Transaction, TransactionResponse } from '@/types'
import { getDates } from '@/utils'
import { getMany, updateMany } from '@/utils/api'
import { QUERY_STALE_TIME, TRANSACTION_RESPONSE_LIMIT } from '@/utils/constants'
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'


function useTransactions(userId:string | undefined, primaryUserBank: Bank | null, selectedDate:Date, sequence: number) {
    console.log(selectedDate, 'in usetransaction')
    const queryClient = useQueryClient()

    const {data: userTransactions, isLoading: userTransactionsLoading, isSuccess: userTransactionsSuccess, isFetchingNextPage: fetchingMoreUserTransactions, hasNextPage:  userTransactionHasMore, fetchNextPage: fetchMoreUserTransactions} = useInfiniteQuery({
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
            cursor: sequence || 0
        }),
        enabled: !!userId && !!primaryUserBank?.listener_email,
        retry: false,
        staleTime: QUERY_STALE_TIME,
        initialPageParam: sequence,
        getNextPageParam: (lastPage, pages) => lastPage.cursor,
        
    }
)
    // do this work in select callback in useinfinitequery
    const transactions: Transaction[] = []
    if (userTransactions){
        // console.log(userTransactions, 'userTransactions')
        userTransactions.pages.forEach((item: TransactionResponse,i)=>{
            if (item.transactions){
                transactions.push(...item.transactions)
                sequence = item.cursor ?? 0
            }
        })
    }
    console.log(transactions, 'transactions... ')


    const {mutate: updateTransactions, isSuccess: updateTransactionsSuccess, isPending: updateTransactionsPending, data: updatedTransactions, variables} = useMutation({
        mutationFn: (data: EditTransaction) => updateMany<Transaction[], EditTransaction>('/transactions', data),
        onMutate: async (data) => {
            // console.log(data, 'data in onMutate')
            await queryClient.cancelQueries({queryKey: ["transactions", userId, primaryUserBank?.id, selectedDate]})
            const previousTransactionsData= queryClient.getQueryData<InfiniteData<TransactionResponse>>(["transactions", userId, primaryUserBank?.id, selectedDate])
            const categories:Category[] | undefined = queryClient.getQueryData(["categories"])
            // console.log(previousTransactionsData, "previoustransactions")
            // console.log(categories, "categories")
            const {transactionIds, categoryId, vpaName} = data
            const previousUpdatedTransactions = previousTransactionsData?.pages.map(page=>{
                return {
                    ...page,
                    transactions: page.transactions.map(tx=>{
                        if (transactionIds.includes(tx.id)){
                            const foundCategory = categories?.find(ct => ct.id === categoryId)
                            return {
                                ...tx,
                                userUpiCategoryNameMapping:{
                                    ...tx.userUpiCategoryNameMapping,
                                    category: foundCategory,
                                    category_id: categoryId,
                                    upi_name: vpaName
                                },
    
                            }
                        }
                        return tx
                    })
                }
            }) as InfiniteData<TransactionResponse>['pages']
            // console.log(previousTransactionsData, 'previousudpatedtranascitons')
            queryClient.setQueryData<InfiniteData<TransactionResponse>>(["transactions", userId, primaryUserBank?.id, selectedDate], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: previousUpdatedTransactions
                };
            })
            return {previousTransactionsData}
        },
        onError(error, variables, context) {
            console.log(error, 'error in onError')
            queryClient.setQueryData(["transactions", userId, primaryUserBank?.id, selectedDate], context?.previousTransactionsData)
            toast.error("Error updating transactions")
        },
        onSettled: (data, variables, context) => {
            // console.log(data, 'data in onSuccess')
            queryClient.invalidateQueries({
                queryKey: ["transactions", userId, primaryUserBank?.id, selectedDate]
            })
        },
        onSuccess(data, variables, context) {
            // console.log(data, 'data in onSuccess')
            toast.success("Updated Transactions Successfully")
        },
    })
  return {
        userTransactions: transactions,
        userTransactionsLoading,
        userTransactionsSuccess,
        updateTransactions,
        updateTransactionsSuccess,
        updateTransactionsPending,
        updatedTransactions,
        variables,
        fetchingMoreUserTransactions,
        userTransactionHasMore,
        fetchMoreUserTransactions
  }
}

export default useTransactions