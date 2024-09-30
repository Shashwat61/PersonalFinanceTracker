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
import { PRIMARY_BANK_KEY } from '@/utils/constants'
import { Bank } from '@/types'
import HomeHeader from '@/components/custom/HomeHeader'

function Home() {
  
  const {userData, primaryUserBank, userDataLoading, userBanks, addUserBank, addUserBankSuccess ,isUserError, userError, addUserBankPending} = useUserContext()
  const {bankSeedData} = useBankContext()
  



  
  
  if (isUserError){
    return (
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground">There was an error fetching your data. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

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
   />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,234.00</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,743.00</div>
            <p className="text-xs text-muted-foreground">-4.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Online Payment', date: '2023-06-30', amount: -1500 },
                { type: 'Salary Deposit', date: '2023-06-28', amount: 5000 },
                { type: 'Grocery Shopping', date: '2023-06-27', amount: -850 },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.type}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flexi Benefits */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Bills</CardTitle>
            <Button variant="ghost" size="sm">
              Manage
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['WiFi', 'Petrol', 'Course', 'Health', 'Food'].map((category, index) => (
                <div key={category}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{category}</span>
                    <span>{20 + index * 15}%</span>
                  </div>
                  <Progress value={20 + index * 15} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default WithLayout(Home)