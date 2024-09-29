import { Bank } from '@/types'
import { getCookie } from '@/utils'
import { QUERY_STALE_TIME } from '@/utils/constants'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function useBankData(enabled: boolean) {
    const {data: bankSeedData, isLoading: bankSeedDataLoading} = useQuery({
        queryKey: ["seed_banks"],
        queryFn: async (): Promise<Bank[]> => {
            const response = await fetch("http://localhost:3000/api/banks", {
                headers: {
                    Authorization: getCookie("token")
                }
            })
            return response.json()
        },
        enabled: !enabled,
        retry: false,
        staleTime: QUERY_STALE_TIME,
        throwOnError: false
        })
  return {
        bankSeedData,
        bankSeedDataLoading
  }
}

export default useBankData