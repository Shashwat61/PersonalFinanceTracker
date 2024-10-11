import { Bank, DefaultGetManyParams, Transaction, User } from "@/types";
import { createSingle, getMany, getSingle } from "@/utils/api";
import { PRIMARY_BANK_KEY, QUERY_STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useFilters from "./useFilters";

function useUserData(){
    const [primaryUserBank, setPrimaryUserBank] = useState<Bank | null>(null)
    const {selectedDate, setSelectedDate} = useFilters()
    console.log(selectedDate, 'selectedDate')
    const queryClient = useQueryClient()
    let userBanks: Bank[] = []
    console.log(primaryUserBank, 'primaryuserbank')
    
    const {data: userData, isLoading: userDataLoading, isSuccess: userDataSuccess, error: userError, isError: isUserError } = useQuery({
        queryKey: ["user"],
        queryFn:  () => getSingle<User>('/user/me'),
        enabled: true,
        retry: false,
        staleTime: QUERY_STALE_TIME
    })
    if (userDataSuccess) userBanks = userData.banks ?? []
    console.log(!!userData?.id && !!primaryUserBank?.listener_email)
    

    const {mutate: addUserBank, isSuccess: addUserBankSuccess, isPending: addUserBankPending} = useMutation({
        mutationFn: (data: {userId: string, bankId: string}) => createSingle<unknown, {userId: string, bankId: string}>('/banks/user', data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: ['user']})
            toast.success("Added Bank Successfully")
        }
    })

    const {data: userTransactions, isLoading: userTransactionsLoading, isSuccess: userTransactionsSuccess} = useQuery({
        queryKey: ["transactions", userData?.id, primaryUserBank?.id],
        // after=2024-10-06&before=2024-10-07&bankId=${primaryUserBank?.id}&from=${primaryUserBank?.listener_email}&limit=${10}
        queryFn: () => getMany<Transaction[], DefaultGetManyParams>(`/transactions/v2`, {
            filters: {
                from: primaryUserBank!.listener_email!,
                limit: 10
            },
            dates: {
                after: selectedDate.toISOString(),
                before: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            },
            id: primaryUserBank!.id,
        }),
        enabled: !!userData?.id && !!primaryUserBank?.listener_email,
        retry: false,
        staleTime: QUERY_STALE_TIME
    })

    useEffect(()=>{
        if (userData?.banks?.length){
            // store the first bank in local storage as the primary bank
            if (!localStorage.getItem(PRIMARY_BANK_KEY)){
                localStorage.setItem(PRIMARY_BANK_KEY, userData.banks[0].id)
            }else{
                const primaryBankId = localStorage.getItem(PRIMARY_BANK_KEY)
                const primaryBank = userData.banks.find(bank => bank.id === primaryBankId)
                setPrimaryUserBank(primaryBank ?? null)
            }
            
        }
    },[userData])

    return {
        userData,
        userDataLoading,
        userBanks,
        addUserBank,
        userError,
        isUserError,
        primaryUserBank,
        setPrimaryUserBank,
        addUserBankSuccess,
        addUserBankPending,
        userTransactions,
        userTransactionsLoading,
        userTransactionsSuccess,
        selectedDate,
        setSelectedDate
    }
}
export default useUserData;
