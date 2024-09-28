import React from 'react'
import WithLayout from '../../components/WithLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {Calendar as CalendarComponent} from '../../components/ui/calendar'
import { Calendar, ChevronRight, CreditCard, DollarSign, Lock, TrendingDown, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <>
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome mafiaa <span className="wave">👋</span>
        </h1>
        <p className="text-muted-foreground mb-4">This is the Central Hub for all your Home.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="main">Main Street</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="suburb">Suburb</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
        <p className="text-sm text-muted-foreground mt-2 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Upgrade to LITE or above to unlock more time frames
        </p>
      </CardContent>
    </Card>
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
            <CardTitle>Flexi Benefits</CardTitle>
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