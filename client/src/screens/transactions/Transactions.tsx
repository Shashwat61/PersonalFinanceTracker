import React, { useState } from 'react'
import { CreditCard, Search, Filter, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WithLayout from '@/components/WithLayout'

 function Transactions() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Online Payment', date: '2023-06-30', amount: -1500, category: 'Shopping' },
    { id: 2, type: 'Grocery Shopping', date: '2023-06-29', amount: -850, category: 'Food' },
    { id: 3, type: 'Salary Deposit', date: '2023-06-28', amount: 5000, category: 'Income' },
    { id: 4, type: 'Utility Bill', date: '2023-06-27', amount: -200, category: 'Bills' },
    { id: 5, type: 'Restaurant', date: '2023-06-26', amount: -750, category: 'Food' },
  ])

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>All Transactions</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center w-1/2">
              <Input placeholder="Search transactions..." className="mr-2" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="This Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="3-months">Last 3 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-b-0">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        {transaction.type}
                      </div>
                    </td>
                    <td className="py-3">{transaction.date}</td>
                    <td className={`py-3 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="py-3">
                      <Select defaultValue={transaction.category}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Income">Income</SelectItem>
                          <SelectItem value="Bills">Bills</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
  )
}
export default WithLayout(Transactions)