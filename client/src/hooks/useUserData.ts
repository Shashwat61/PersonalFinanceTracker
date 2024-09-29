import { Bank, User } from "@/types";
import { createSingle, getSingle } from "@/utils/api";
import { QUERY_STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useUserData(){
    const queryClient = useQueryClient()
    let userBanks: Bank[] = []
    const {data: userData, isLoading: userDataLoading, isSuccess: userDataSuccess, error: userError, isError: isUserError } = useQuery({
        queryKey: ["user"],
        queryFn:  () => getSingle<User>('/user/me'),
        enabled: true,
        retry: false,
        staleTime: QUERY_STALE_TIME
    })
    if (userDataSuccess) userBanks = userData.banks ?? []


    const {mutate: addUserBank} = useMutation({
        mutationFn: (data: {userId: string, bankId: string}) => createSingle<unknown, {userId: string, bankId: string}>('/banks/user', data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: ['user']})
        }
    })


    return {
        userData,
        userDataLoading,
        userBanks,
        addUserBank,
        userError,
        isUserError
    }
}
export default useUserData;
