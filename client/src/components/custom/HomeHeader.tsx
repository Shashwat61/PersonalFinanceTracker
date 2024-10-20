import { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { AddUserBank, Bank, User, UserBankMapping } from '@/types'
import { UseMutateFunction } from '@tanstack/react-query'
import DatePicker from './DatePicker'
import BankSelect from './BankSelector'
import BankModal from './BankModal'

interface HomeHeaderProps {
  addUserBank: UseMutateFunction<unknown, Error, AddUserBank, unknown>;
  userBanks: Bank[] | undefined
  addUserBankPending: boolean
  userData: User | undefined
  userDataLoading: boolean
  primaryUserBank?: Bank | null
  bankSeedData: Bank[] | undefined
  setSelectedDate: (date: Date) => void
  selectedDate: Date
  addBankSuccess: boolean
  primaryUserBankMapping: UserBankMapping | null
  userBankMapping: UserBankMapping[]
}

function HomeHeader({ addUserBank, userBanks, bankSeedData, addUserBankPending, userData, userDataLoading, primaryUserBank, setSelectedDate, selectedDate, addBankSuccess, primaryUserBankMapping, userBankMapping }: HomeHeaderProps) {
  const [openBankModal, setOpenBankModal] = useState<boolean>(false)

  function handleOpenBankModal(){
    setOpenBankModal(true)
  }
  function handleAddUserBank(selectedBankId: string, bankAccountNumber: string) {
    console.log(selectedBankId, bankAccountNumber)
    if (userData && selectedBankId && bankAccountNumber) {
      addUserBank({ userId: userData.id, bankId: selectedBankId, accountNumber: bankAccountNumber })
    }
  }

  useEffect(()=> {
    if(addBankSuccess){
      setOpenBankModal(false)
    }
  },[addBankSuccess])

  return (
    <>
    <Card className="mb-6">
      <CardContent className="pt-6">
        {userDataLoading ? (
          <>
            <h1 className="mb-2 text-3xl font-bold">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we fetch your data.</p>
          </>
        ) : !userBanks?.length ? (
          <>
            <h1 className="mb-2 text-3xl font-bold">
              Welcome {userData?.name} <span className="wave">👋</span>
            </h1>
            <p className="mb-4 text-muted-foreground">You haven't added any banks yet. Add a bank to get started.</p>
            <div className='flex gap-6 -p-6'>
              <Button disabled={addUserBankPending} onClick={handleOpenBankModal} variant="outline">
                {addUserBankPending ? 'Adding Bank...' : "Add Bank"}
              </Button>
            </div>
            <p className='pt-2 text-muted-foreground'>Note: Automatic retrieval of online transactions are only valid for HDFC bank for now.</p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold">
              Welcome {userData?.name} <span className="wave">👋</span>
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row">
              <BankSelect userBankMappings={userBankMapping} onChange={() => { }} placeholder={primaryUserBankMapping?.bank?.name || "Select Bank"} />
              <div className="flex flex-1 gap-2">
                <DatePicker date={selectedDate} setDate={setSelectedDate} />
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Today" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last7">Last 7 days</SelectItem>
                    <SelectItem value="last30">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
    {openBankModal ? 
    <BankModal
      open={openBankModal}
      setOpen={setOpenBankModal}
      onSave={handleAddUserBank}
      userBankMappings={userBankMapping}
      addingBankPending = {addUserBankPending}
      title={"Add Bank"}
      subTitle = {"Add a new bank account to your FinTrack profile."}
    /> : null}
    </>
    
  )
}

export default HomeHeader