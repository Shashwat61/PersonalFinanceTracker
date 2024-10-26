import  { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WithLayout from '@/components/WithLayout'
import TransactionHeader from '@/components/custom/TransactionHeader'
import useDebounce from '@/hooks/useDebounce'
import useTransactions from '@/hooks/useTransactions'
import { useUserContext } from '@/contexts/UserContext'
import useFilters from '@/hooks/useFilters'
import { useQuery } from '@tanstack/react-query'
import { getManyWithoutParams } from '@/utils/api'
import { AddTransaction, Category, Transaction } from '@/types'
import { QUERY_STALE_TIME } from '@/utils/constants'
import TransactionSlabsContainer from '@/components/custom/TransactionSlabsContainer'
import TransactionModal from '@/components/custom/TransactionModal'


 function Transactions() {
  const {userData, primaryUserBank, primaryUserBankMapping} = useUserContext()
  const [mutableTransaction, setMutableTransaction] = useState<Transaction | null>(null
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch] = useDebounce(search, 500)
  const {selectedDate, setSelectedDate} = useFilters()
  let sequence = 0
  const {userTransactions, updateTransactions, updateTransactionsPending,updateTransactionsSuccess, userTransactionsLoading, userTransactionsSuccess, updatedTransactions, variables, fetchMoreUserTransactions, fetchingMoreUserTransactions, userTransactionHasMore, addTransaction, addTransactionPending, addTransactionSuccess} = useTransactions(userData?.id, primaryUserBankMapping, selectedDate, sequence)
  const [similarTransactionsIds, setSimilarTransactionIds] = useState<string[]>([])
  const [isNewTransaction, setIsNewTransaction] = useState<boolean>(false)

  
  function handleEditTransaction(transaction: Transaction){
    setMutableTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  function handleSaveTransaction(transaction: Transaction){
    const userUpiCategoryNameMapping = transaction.userUpiCategoryNameMapping
    const similarTransactionsIds = userTransactions.filter(txn => (txn.user_upi_category_name_mapping_id == userUpiCategoryNameMapping?.id)).map(txn => txn.id)
    setSimilarTransactionIds(similarTransactionsIds)
    updateTransactions({transactionIds: similarTransactionsIds, categoryId: userUpiCategoryNameMapping?.category_id || "", vpaName: userUpiCategoryNameMapping?.upi_name || ""})
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
    setMutableTransaction({id: '',
      amount: 0,
      bank_account_number: primaryUserBankMapping!.account_number,
      transaction_metadata_id: '',
      transaction_type: '',
      user_id: userData!.id,
      user_bank_mapping_id: primaryUserBankMapping!.id,
      transacted_at: new Date(),
      created_at: new Date().toLocaleDateString(),
      updated_at: new Date().toLocaleDateString(),
      sequence: 0,
      user_upi_category_name_mapping_id: '',
      mode: 'cash',
      userUpiCategoryNameMapping: {
        id: '',
        category_id: '',
        upi_name: '',
        user_id: userData!.id,
        created_at: new Date().toLocaleDateString(),
        updated_at: new Date().toLocaleDateString(),
        upi_id: ''
      },
      message_id: null
      })
  }

  function saveNewTransaction(transaction: Transaction){
    // handle description
    const requestPayload: AddTransaction = {
      bank_account_number: transaction!.bank_account_number.toString(),
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      mode: transaction.mode,
      transacted_at: new Date().getFullYear() +"/" + (Number(new Date().getMonth() + 1)) + "/" + new Date().getDate(),
      user_bank_mapping_id: transaction.user_bank_mapping_id,
      category_id: transaction!.userUpiCategoryNameMapping!.category_id! // always available as without selecting the category id this function will not be called
    }
    addTransaction(requestPayload)
    setIsNewTransaction(false)
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
        transaction={mutableTransaction}
        onSave={handleSaveTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        categories = {categories}
        isEditing = {!isNewTransaction}
      />: null}
      {
        isNewTransaction ? <TransactionModal
        placeholder='Add Transaction'
        transaction={mutableTransaction}
        onSave={saveNewTransaction}
        open={isNewTransaction}
        onOpenChange={setIsNewTransaction}
        categories = {categories}
        isEditing = {false}
        /> : null
      }
    </>
  )
}

export default WithLayout(Transactions)