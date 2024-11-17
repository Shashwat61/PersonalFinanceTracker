import WithLayout from '../../components/WithLayout'
import { Card, CardContent } from '@/components/ui/card'

import { useUserContext } from '@/contexts/UserContext'
import { useBankContext } from '@/contexts/BankContext'
import HomeHeader from '@/components/custom/HomeHeader'
import HomeAnalytics from '@/components/custom/HomeAnalytics'
import useFilters from '@/hooks/useFilters'
import useTransactions from '@/hooks/useTransactions'

function Home() {
  
  const {userData, primaryUserBank, userDataLoading, userBanks, addUserBank, addUserBankSuccess ,isUserError, addUserBankPending, primaryUserBankMapping, userBankMapping} = useUserContext()
  const {bankSeedData} = useBankContext()
  const {selectedDate, setSelectedDate}= useFilters()
  const {userTransactions,  userTransactionsLoading} = useTransactions(userData?.id, primaryUserBankMapping, selectedDate)
  
  
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
          addBankSuccess={addUserBankSuccess}
          primaryUserBankMapping = {primaryUserBankMapping}
          userBankMapping = {userBankMapping}
     />
     <HomeAnalytics recentTransactions={userTransactions} userTransactionsLoading = {userTransactionsLoading}/>
      
      </>
    )
  }

}

export default WithLayout(Home)