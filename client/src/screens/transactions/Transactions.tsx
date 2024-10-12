import React, { useState } from 'react'
import { CreditCard, Search, Filter, ChevronDown, ChevronUp, Plus, ArrowUpRight, ArrowDownRight, Edit2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import WithLayout from '@/components/WithLayout'
import TransactionSlab from '@/components/custom/TransactionSlab'
import EditTransactionModal from '@/components/custom/EditTransactionModal'
import TransactionHeader from '@/components/custom/TransactionHeader'
import useDebounce from '@/hooks/useDebounce'
import useTransactions from '@/hooks/useTransactions'
import { useUserContext } from '@/contexts/UserContext'
import useFilters from '@/hooks/useFilters'

const initialTransactions = [
  { id: 1, type: 'Online Payment', date: '2023-06-30', amount: -1500, category: 'Shopping', description: 'Amazon.com', balance: 3500 },
  { id: 2, type: 'Grocery Shopping', date: '2023-06-29', amount: -850, category: 'Food', description: 'Whole Foods Market', balance: 5000 },
  { id: 3, type: 'Salary Deposit', date: '2023-06-28', amount: 5000, category: 'Income', description: 'Monthly Salary', balance: 5850 },
  { id: 4, type: 'Utility Bill', date: '2023-06-27', amount: -200, category: 'Bills', description: 'Electricity Bill', balance: 850 },
  { id: 5, type: 'Restaurant', date: '2023-06-26', amount: -750, category: 'Food', description: 'Dinner with friends', balance: 1050 },
]





 function Transactions() {
  const {userData, primaryUserBank} = useUserContext()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce(search, 500)
  const {selectedDate, setSelectedDate} = useFilters()
  const {userTransactions} = useTransactions(userData?.id, primaryUserBank, selectedDate)

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleSaveTransaction = (editedTransaction) => {
    setTransactions(transactions.map(t => t.id === editedTransaction.id ? editedTransaction : t))
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <TransactionHeader 
            search = {search}
            setSearch = {setSearch}
            setSelectedDate={setSelectedDate}
            />

            <div className="space-y-4">
              {userTransactions.map((transaction) => (
                <TransactionSlab 
                  key={transaction.id} 
                  transaction={transaction} 
                  onEdit={handleEditTransaction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditTransactionModal 
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  )
}

export default WithLayout(Transactions)