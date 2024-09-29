import { User } from "@/types";
import { getCookie } from "@/utils";
import { QUERY_STALE_TIME } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function useUserData(){
    const queryClient = useQueryClient()

    const {data: userData, isLoading: userDataLoading  } = useQuery({
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

    return {
        userData,
        userDataLoading
    }
}
export default useUserData;
