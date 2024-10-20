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
import TransactionHeader from '@/components/custom/TransactionHeader'
import useDebounce from '@/hooks/useDebounce'
import useTransactions from '@/hooks/useTransactions'
import { useUserContext } from '@/contexts/UserContext'
import useFilters from '@/hooks/useFilters'
import { useQuery } from '@tanstack/react-query'
import { getMany, getManyWithoutParams } from '@/utils/api'
import { Category, Transaction } from '@/types'
import { QUERY_STALE_TIME } from '@/utils/constants'
import TransactionSlabsContainer from '@/components/custom/TransactionSlabsContainer'
import TransactionModal from '@/components/custom/TransactionModal'


 function Transactions() {
  const {userData, primaryUserBank, primaryUserBankMapping} = useUserContext()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce(search, 500)
  const {selectedDate, setSelectedDate} = useFilters()
  let sequence = 0
  const {userTransactions, updateTransactions, updateTransactionsPending,updateTransactionsSuccess, userTransactionsLoading, userTransactionsSuccess, updatedTransactions, variables, fetchMoreUserTransactions, fetchingMoreUserTransactions, userTransactionHasMore} = useTransactions(userData?.id, primaryUserBankMapping, selectedDate, sequence)
  const [similarTransactionsIds, setSimilarTransactionIds] = useState<string[]>([])
  const [isNewTransaction, setIsNewTransaction] = useState<boolean>(false)

  
  function handleEditTransaction(transaction: Transaction){
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  function handleSaveTransaction(transaction: Transaction){
    const userUpiCategoryNameMapping = transaction.userUpiCategoryNameMapping
    const similarTransactionsIds = userTransactions.filter(txn => (txn.user_upi_category_name_mapping_id == userUpiCategoryNameMapping.id)).map(txn => txn.id)
    setSimilarTransactionIds(similarTransactionsIds)
    updateTransactions({transactionIds: similarTransactionsIds, categoryId: userUpiCategoryNameMapping.category_id || "", vpaName: userUpiCategoryNameMapping.upi_name || ""})
    setIsEditDialogOpen(false)
  }

  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: ()=> getManyWithoutParams<Category[]>('/categories'),
    enabled: true,
    staleTime: QUERY_STALE_TIME
  })
  function handleAddTransaction(){
    setIsNewTransaction(true)
    setEditingTransaction({
      
    })
    setIsEditDialogOpen(true)
  }
  return (
    <>
      <div className="space-y-4 overflow-hidden ">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button onClick={handleAddTransaction}>
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className="p-6">
            <TransactionHeader 
            search = {search}
            setSearch = {setSearch}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            />

            <TransactionSlabsContainer 
            transactions = {userTransactions} 
            handleEditTransaction = {handleEditTransaction}
            updateTransactionsPending = {updateTransactionsPending}
            similarTransactionsIds={similarTransactionsIds}
            updateTransactionsSuccess = {updateTransactionsSuccess}
            fetchingMoreTransactions = {fetchingMoreUserTransactions}
            fetchMoreTransactions = {fetchMoreUserTransactions}
            hasMore = {userTransactionHasMore}
            />
          </CardContent>
        </Card>
      </div>
                    
      {isEditDialogOpen ? <TransactionModal
        placeholder='Edit Transaction'
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        categories = {categories}
        isEditing = {!isNewTransaction}
      />: null}
    </>
  )
}

export default WithLayout(Transactions)