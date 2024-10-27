import { AddTransaction, Category, DefaultGetManyParams, EditTransaction, Transaction, TransactionResponse, UserBankMapping } from '@/types'
import { getDates, getIncrementId } from '@/utils'
import { createSingle, getMany, updateMany } from '@/utils/api'
import { QUERY_STALE_TIME, TRANSACTION_RESPONSE_LIMIT } from '@/utils/constants'
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'


function useTransactions(userId:string | undefined, primaryUserBankMapping: UserBankMapping | null, selectedDate:Date, sequence?: number | null) {
    console.log(selectedDate, '=========in usetransaction hook========', sequence)
    const queryClient = useQueryClient()

    const {data: userTransactions, isLoading: userTransactionsLoading, isSuccess: userTransactionsSuccess, isFetchingNextPage: fetchingMoreUserTransactions, hasNextPage:  userTransactionHasMore, fetchNextPage: fetchMoreUserTransactions} = useInfiniteQuery({
        queryKey: ["transactions", userId, primaryUserBankMapping?.id, selectedDate],
        queryFn: () => {
            console.log("calling transactions api=============")
            return getMany<TransactionResponse, DefaultGetManyParams>(`/transactions/v2`, {
            filters: {
                from: primaryUserBankMapping?.bank?.listener_email || '',
                limit: TRANSACTION_RESPONSE_LIMIT
            },
            dates: {
                ...getDates(selectedDate)
            },
            id: primaryUserBankMapping?.id,
            cursor: sequence || 0
        })},
        enabled: !!userId && !!primaryUserBankMapping?.bank?.listener_email,
        retry: false,
        staleTime: QUERY_STALE_TIME,
        initialPageParam: sequence,
        getNextPageParam: (lastPage, pages) => lastPage.cursor ?? null,
    }
)
console.log(sequence, '=======sequence in use transaction=======')
    // do this work in select callback in useinfinitequery
    const transactions: Transaction[] = []
    if (userTransactions){
        // console.log(userTransactions, 'userTransactions')
        userTransactions.pages.forEach((item: TransactionResponse,i)=>{
            if (item.transactions){
                transactions.push(...item.transactions)
                sequence = item.cursor ?? null
            }
        })
    }
    console.log(transactions, 'transactions... ', sequence)


    const {mutate: updateTransactions, isSuccess: updateTransactionsSuccess, isPending: updateTransactionsPending, data: updatedTransactions, variables} = useMutation({
        mutationFn: (data: EditTransaction) => updateMany<Transaction[], EditTransaction>('/transactions', data),
        onMutate: async (data) => {
            // console.log(data, 'data in onMutate')
            await queryClient.cancelQueries({queryKey: ["transactions", userId, primaryUserBankMapping?.id, selectedDate]})
            const previousTransactionsData= queryClient.getQueryData<InfiniteData<TransactionResponse>>(["transactions", userId, primaryUserBankMapping?.id, selectedDate])
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
            queryClient.setQueryData<InfiniteData<TransactionResponse>>(["transactions", userId, primaryUserBankMapping?.id, selectedDate], (oldData) => {
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
            queryClient.setQueryData(["transactions", userId, primaryUserBankMapping?.id, selectedDate], context?.previousTransactionsData)
            toast.error("Error updating transactions")
        },
        onSettled: (data, variables, context) => {
            // console.log(data, 'data in onSuccess')
            // sequence = 0
            // queryClient.invalidateQueries({
            //     queryKey: ["transactions", userId, primaryUserBankMapping?.id, selectedDate]
            // })
        },
        onSuccess(data, variables, context) {
            // console.log(data, 'data in onSuccess')
            toast.success("Updated Transactions Successfully")
        },
    })

    const {mutate: addTransaction, isPending: addTransactionPending, isSuccess: addTransactionSuccess} = useMutation({
        mutationFn: (data: AddTransaction) => createSingle<Transaction, AddTransaction>("/transactions/add", data),
        onMutate: async(variables) => {
            await queryClient.cancelQueries({queryKey: ["transactions", userId, primaryUserBankMapping?.id, selectedDate]})
            const previousTransactionsData= queryClient.getQueryData<InfiniteData<TransactionResponse>>(["transactions", userId, primaryUserBankMapping?.id, selectedDate])
            const optimisticTransactionId = getIncrementId()
            const optimisticUserUpiCategoryNameMappingId = getIncrementId()
            const categories:Category[] | undefined = queryClient.getQueryData(["categories"])
            const foundCategory = categories?.find(category => category.id === variables.category_id)
            const optimisticTransaction: Transaction = {
                ...variables,
                user_id: userId!,
                created_at: new Date().toLocaleDateString(),
                updated_at: new Date().toLocaleDateString(),
                sequence: 0,
                id: optimisticTransactionId,
                bank_account_number: primaryUserBankMapping!.account_number,
                userUpiCategoryNameMapping: {
                    id: optimisticUserUpiCategoryNameMappingId,
                    category_id: variables.category_id,
                    created_at: new Date().toLocaleDateString(),
                    updated_at: new Date().toLocaleDateString(),
                    user_id: userId!,
                    category: foundCategory
                },
                transaction_metadata_id: null,
                message_id: null,
                user_upi_category_name_mapping_id: optimisticUserUpiCategoryNameMappingId
            }
            const previousUpdatedTransactions = (previousTransactionsData?.pages || []).map((page, index)=>{
                if(index==0 && (!page || Object.keys(page).length === 0)){

                    return {
                        ...page,
                        transactions: [optimisticTransaction]
                    }
                }
                return {
                    ...page,
                    transactions: [optimisticTransaction, ...page.transactions]
                }
            }) as InfiniteData<TransactionResponse>['pages']
            queryClient.setQueryData<InfiniteData<TransactionResponse>>(["transactions", userId, primaryUserBankMapping?.id, selectedDate], (oldData) => {
                if(!oldData) return oldData
                return {
                    ...oldData,
                    pages: previousUpdatedTransactions ?? []
                }
            })
            return {previousTransactionsData}
        },
        onError: (error, variables, context) => {
            console.log(error, 'error in onError')
            queryClient.setQueryData(["transactions", userId, primaryUserBankMapping?.id, selectedDate], context?.previousTransactionsData)
            toast.error("Error adding transaction")
        },
        onSettled: (data, variables, context) => {
            // console.log(data, 'data in onSuccess')
            // queryClient.invalidateQueries({
            //     queryKey: ["transactions", userId, primaryUserBankMapping?.id, selectedDate]
            // })
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
        fetchMoreUserTransactions,
        addTransaction,
        addTransactionSuccess,
        addTransactionPending,
  }
}

export default useTransactions