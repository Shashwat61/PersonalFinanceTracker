import { AddUserBank, Bank, User, UserBankMapping } from "@/types";
import { createSingle, getSingle } from "@/utils/api";
import { PRIMARY_USER_BANK_MAPPING_KEY, QUERY_STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function useUserData(){
    const [primaryUserBank, setPrimaryUserBank] = useState<Bank | null>(null)
    const [primaryUserBankMapping, setPrimaryUserBankMapping] = useState<UserBankMapping | null>(null)

    const queryClient = useQueryClient()
    let userBanks: Bank[] = []
    let userBankMapping: UserBankMapping[] = []
    console.log(primaryUserBank, 'primaryuserbank')
    
    const {data: userData, isLoading: userDataLoading, isSuccess: userDataSuccess, error: userError, isError: isUserError } = useQuery({
        queryKey: ["user"],
        queryFn:  () => getSingle<User>('/user/me'),
        enabled: true,
        retry: false,
        staleTime: QUERY_STALE_TIME
    })
    if (userDataSuccess){
        userBankMapping = userData.userBankMappings
        if(userBankMapping.length > 0){
            userBanks = userBankMapping.map((mapping) => mapping.bank)
        }
    }
    console.log(!!userData?.id && !!primaryUserBank?.listener_email)
    

    const {mutate: addUserBank, isSuccess: addUserBankSuccess, isPending: addUserBankPending} = useMutation({
        mutationFn: (data: AddUserBank) => createSingle<Bank, AddUserBank>('/banks/user', data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: ['user']})
            toast.success("Added Bank Successfully")
        }
    })

    

    useEffect(()=>{
        if (userBankMapping.length > 0){
            // store the first bank in local storage as the primary bank
            if (!localStorage.getItem(PRIMARY_USER_BANK_MAPPING_KEY)){
                localStorage.setItem(PRIMARY_USER_BANK_MAPPING_KEY, userBankMapping[0].id)
                setPrimaryUserBankMapping(userBankMapping[0])
            }else{
                const primaryBankId = localStorage.getItem(PRIMARY_USER_BANK_MAPPING_KEY)
                const primaryuserBankMapping = userBankMapping.find(ubm => ubm.id === primaryBankId)
                setPrimaryUserBankMapping(primaryuserBankMapping ?? null)
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
        primaryUserBankMapping,
        setPrimaryUserBankMapping,
        userBankMapping
    }
}
export default useUserData;
