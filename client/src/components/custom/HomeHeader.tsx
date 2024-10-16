import React, { Dispatch, SetStateAction, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { PRIMARY_BANK_KEY } from '@/utils/constants'
import { Bank, User } from '@/types'
import { UseMutateFunction } from '@tanstack/react-query'
import DatePicker from './DatePicker'
import BankSelect from './BankSelector'

interface HomeHeaderProps {
  addUserBank: UseMutateFunction<unknown, Error, { userId: string; bankId: string }, unknown>;
  userBanks: Bank[] | undefined
  addUserBankPending: boolean
  userData: User | undefined
  userDataLoading: boolean
  primaryUserBank?: Bank | null
  bankSeedData: Bank[] | undefined
  setSelectedDate: (date: Date) => void
  selectedDate: Date
}

function HomeHeader({ addUserBank, userBanks, bankSeedData, addUserBankPending, userData, userDataLoading, primaryUserBank, setSelectedDate, selectedDate }: HomeHeaderProps) {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)

  function handleAddUserBank() {
    if (userData && selectedBankId) {
      addUserBank({ userId: userData.id, bankId: selectedBankId })
      localStorage.setItem(PRIMARY_BANK_KEY, selectedBankId)
    }
  }

  return (
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
              Welcome Boss <span className="wave">👋</span>
            </h1>
            <p className="mb-4 text-muted-foreground">You haven't added any banks yet. Add a bank to get started.</p>
            <div className='flex gap-6 -p-6'>
              <BankSelect banks={bankSeedData} onChange={setSelectedBankId} placeholder="All Bank Branches" />
              <Button disabled={addUserBankPending} onClick={handleAddUserBank} variant="outline">
                {addUserBankPending ? 'Adding Bank...' : "Add Bank"}
              </Button>
            </div>
            <p className='pt-2 text-muted-foreground'>Note: Automatic retrieval of online transactions are only valid for HDFC bank for now.</p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold">
              Welcome Boss <span className="wave">👋</span>
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row">
              <BankSelect banks={userBanks} onChange={() => { }} placeholder={primaryUserBank?.name || "Select Bank"} />
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
  )
}

export default HomeHeader