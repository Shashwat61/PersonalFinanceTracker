import React, { useState } from 'react'
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
}

function HomeHeader({ addUserBank, userBanks, bankSeedData, addUserBankPending, userData, userDataLoading, primaryUserBank }: HomeHeaderProps) {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

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
            <h1 className="text-3xl font-bold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we fetch your data.</p>
          </>
        ) : !userBanks?.length ? (
          <>
            <h1 className="text-3xl font-bold mb-2">
              Welcome Boss <span className="wave">👋</span>
            </h1>
            <p className="text-muted-foreground mb-4">You haven't added any banks yet. Add a bank to get started.</p>
            <div className='flex gap-6 -p-6'>
              <BankSelect banks={bankSeedData} onChange={setSelectedBankId} placeholder="All Bank Branches" />
              <Button disabled={addUserBankPending} onClick={handleAddUserBank} variant="outline">
                {addUserBankPending ? 'Adding Bank...' : "Add Bank"}
              </Button>
            </div>
            <p className='text-muted-foreground pt-2'>Note: Automatic retrieval of online transactions are only valid for HDFC bank for now.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">
              Welcome Boss <span className="wave">👋</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <BankSelect banks={userBanks} onChange={() => { }} placeholder={primaryUserBank?.name || "Select Bank"} />
              <div className="flex-1 flex gap-2">
                <DatePicker date={date} setDate={setDate} />
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