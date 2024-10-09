import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChevronRight, CreditCard, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import RecentInfoBox from '../RecentInfoBox'
import RecentTransactionRow from './RecentTransactionRow'
import { useNavigate } from 'react-router-dom'
import { Transaction } from '@/types'

interface HomeAnalyticsProps{
  recentTransactions: Transaction[]
  userTransactionsLoading: boolean
}

function HomeAnalytics({recentTransactions}: HomeAnalyticsProps) {
  const navigate = useNavigate()
  
  function redirectTo(val: string){
    console.log('redirecting')
    navigate(val)
  }
  return (
    <div>
    
    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12,234.00</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹8,743.00</div>
              <p className="text-xs text-muted-foreground">-4.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <RecentInfoBox title={"Recent Transactions"} subtitle='View All' 
            recentData={recentTransactions || []}
              type='transactions'
              ComponentToRender={RecentTransactionRow}
              recentListLimit={5}
              cta={()=> redirectTo('transactions')}
          />
  
          {/* Flexi Benefits */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Bills</CardTitle>
              <Button variant="ghost" size="sm">
                Manage
                <ChevronRight className="w-4 h-4 ml-2" />
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
        </div>
  )
}

export default HomeAnalytics