import React, { useState } from 'react'
import WithLayout from '../../components/WithLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import { Calendar, ChevronRight, CreditCard, DollarSign, Lock, TrendingDown, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useUserContext } from '@/contexts/UserContext'
import { useBankContext } from '@/contexts/BankContext'
import { PRIMARY_BANK_KEY, QUERY_STALE_TIME } from '@/utils/constants'
import { Bank, Category } from '@/types'
import HomeHeader from '@/components/custom/HomeHeader'
import HomeAnalytics from '@/components/custom/HomeAnalytics'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import useFilters from '@/hooks/useFilters'
import useTransactions from '@/hooks/useTransactions'
import { getManyWithoutParams } from '@/utils/api'

function Home() {
  
  const {userData, primaryUserBank, userDataLoading, userBanks, addUserBank, addUserBankSuccess ,isUserError, userError, addUserBankPending, setPrimaryUserBank} = useUserContext()
  const {bankSeedData} = useBankContext()
  const {selectedDate, setSelectedDate}= useFilters()
  const {userTransactions,  userTransactionsLoading, userTransactionsSuccess} = useTransactions(userData?.id, primaryUserBank, selectedDate)
  
  
  function handleSelectDate(val:Date){
    setSelectedDate(val)
  }

  

  
  
  if (isUserError){
    return (
      <Card>
        <CardContent className="pt-6">
          <h1 className="mb-2 text-3xl font-bold">Error</h1>
          <p className="text-muted-foreground">There was an error fetching your data. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }
  else if(userDataLoading){
    return (
      null
    )
  }
  else{
    return (
      <>
     <HomeHeader
          userDataLoading = {userDataLoading}
          userData = {userData}
          addUserBank = {addUserBank}
          userBanks = {userBanks}
          addUserBankPending = {addUserBankPending}
          primaryUserBank = {primaryUserBank}
          bankSeedData={bankSeedData}
          setSelectedDate= {handleSelectDate}
          selectedDate = {selectedDate}
     />
     <HomeAnalytics recentTransactions={userTransactions} userTransactionsLoading = {userTransactionsLoading}/>
      
      </>
    )
  }

}

export default WithLayout(Home)