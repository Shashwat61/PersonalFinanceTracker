import { Bank, User } from "@/types";
import { getCookie } from "@/utils";
import { QUERY_STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function useUserData(){
    const queryClient = useQueryClient()
    let userBanks: Bank[] = []
    const {data: userData, isLoading: userDataLoading, isSuccess: userDataSuccess  } = useQuery({
        queryKey: ["user"],
        queryFn:  async (): Promise<User> => {
            const response = await fetch("http://localhost:3000/api/user/me", 
                {
                    headers:{
                        Authorization: getCookie("token")
                    }
                }
            )
            return response.json()
        },
        
        enabled: true,
        retry: false,
        staleTime: QUERY_STALE_TIME,
        throwOnError: false
    })
    if (userDataSuccess) userBanks = userData.banks ?? []


    const {mutate: addUserBank} = useMutation({
        mutationFn: (data: {userId: string, bankId: string}) => {
            return fetch("http://localhost:3000/api/banks/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: getCookie("token")
                },
                body: JSON.stringify(data)
            })
        },
        onSuccess: (data, variables, context) => {
            window.alert("User bank is added")
            queryClient.invalidateQueries({queryKey: ['user']})
        }
    })


    return {
        userData,
        userDataLoading,
        userBanks,
        addUserBank
    }
}
export default useUserData;
