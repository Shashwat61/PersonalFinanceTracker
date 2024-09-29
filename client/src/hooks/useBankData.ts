import { Bank } from '@/types'
import { getMany } from '@/utils/api'
import { QUERY_STALE_TIME } from '@/utils/constants'
import { useQuery } from '@tanstack/react-query'

function useBankData(enabled: boolean) {
    const {data: bankSeedData, isLoading: bankSeedDataLoading} = useQuery({
        queryKey: ["seed_banks"],
        queryFn: () => getMany<Bank[]>('/banks'),
        enabled: !enabled,
        retry: false,
        staleTime: QUERY_STALE_TIME,
        })
  return {
        bankSeedData,
        bankSeedDataLoading
  }
}

export default useBankData