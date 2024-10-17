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
import { useQuery } from '@tanstack/react-query'
import { getMany, getManyWithoutParams } from '@/utils/api'
import { Category, Transaction } from '@/types'
import { QUERY_STALE_TIME } from '@/utils/constants'


 function Transactions() {
  const {userData, primaryUserBank} = useUserContext()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce(search, 500)
  const {selectedDate, setSelectedDate} = useFilters()
  const {userTransactions, updateTransactions, updateTransactionsPending,updateTransactionsSuccess, userTransactionsLoading, userTransactionsSuccess, updatedTransactions, variables} = useTransactions(userData?.id, primaryUserBank, selectedDate)
  const [similarTransactionsIds, setSimilarTransactionIds] = useState<string[]>([])
  
  console.log(updatedTransactions, 'updatedTrasnctions')
  
  function handleEditTransaction(transaction: Transaction){
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  function handleSaveTransaction(transaction: Transaction, categoryId?:string, vpaNickName?: string){
    const userUpiCategoryNameMappingId = transaction.user_upi_category_name_mapping_id
    const similarTransactionsIds = userTransactions.filter(txn => (txn.user_upi_category_name_mapping_id == userUpiCategoryNameMappingId)).map(txn => txn.id)
    setSimilarTransactionIds(similarTransactionsIds)
    updateTransactions({transactionIds: similarTransactionsIds, categoryId, vpaName: vpaNickName})
    setIsEditDialogOpen(false)
  }

  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: ()=> getManyWithoutParams<Category[]>('/categories'),
    enabled: true,
    staleTime: QUERY_STALE_TIME
  })

  return (
    <>
      <div className="space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
        </div>

        <Card className='h-[80vh] overflow-scroll no-scrollbar'>
          <CardContent className="p-6">
            <TransactionHeader 
            search = {search}
            setSearch = {setSearch}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            />

            <div className="space-y-4 overflow-scroll">
              {
                userTransactions?.map((transaction) => (
                  <TransactionSlab 
                  key={transaction.id} 
                  transaction={transaction} 
                  onEdit={handleEditTransaction}
                  updateMutationPending={updateTransactionsPending}
                  similarTransactionsIds = {similarTransactionsIds}
                  updateMutationSuccess = {updateTransactionsSuccess}
                  
                  />
                ))}
            </div>
            {!userTransactions.length ? <div className=" justify-self-center text-muted-foreground">No new transactions</div> : null}
          </CardContent>
        </Card>
      </div>
                    
      {isEditDialogOpen ? <EditTransactionModal
        placeholder='Edit Transaction'
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        categories = {categories}
      />: null}
    </>
  )
}

export default WithLayout(Transactions)