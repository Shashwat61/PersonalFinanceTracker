import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Category, Transaction } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { QueryCache } from '@tanstack/react-query'

interface TransactionModelProps{
    transaction: Transaction | null
    onSave: (transaction: Transaction, categoryId?: string, vpaNickName?: string) => void
    open: boolean
    onOpenChange: (open: boolean) => void
    placeholder: string
    categories: Category[] | undefined
}

function EditTransactionModal({ transaction, onSave, open, onOpenChange, placeholder, categories }: TransactionModelProps){
    const transactionMetaData = transaction?.userUpiCategoryNameMapping
    const transactionCategory = transactionMetaData?.category
    const [editedTransaction, setEditedTransaction] = useState(transaction || {})
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [nickName, setNickName] = useState<string>(transactionMetaData?.upi_name || '')
    
    console.log(selectedCategory, nickName, 'nickname', transactionMetaData, transactionCategory)
    // React.useEffect(() => {
    //   if (transaction) {
    //     setEditedTransaction(transaction)
    //   }
    // }, [transaction])
  
    const handleSave = () => {
        if (!transaction) return;
        onSave(transaction, selectedCategory, nickName)
        onOpenChange(false)
    }
  
    if (!transaction) return null
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{placeholder}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Input 
                id="type" 
                value={transaction.transaction_type} 
                onChange={(e) => setEditedTransaction({...transaction, transaction_type: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={transaction.transacted_at} 
                onChange={(e) => setEditedTransaction({...transaction, transacted_at: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={transaction.amount} 
                onChange={(e) => setEditedTransaction({...transaction, amount: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setSelectedCategory}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder={transactionCategory?.name ?? "None"} />
      </SelectTrigger>
      <SelectContent>
        {categories?.map(category => (
            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    
            </div>
            <div>
              <Label htmlFor="description">Nickname for {transaction.payee_upi_id || transaction.receiver_upi_id}</Label>
              <Input
                id="description" 
                value={nickName} 
                onChange={(e) => setNickName(e.target.value)}
              />
              </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={transaction.transaction_metadata_id} 
                onChange={(e) => setEditedTransaction({...transaction, transaction_metadata_id: e.target.value})}
              />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

export default EditTransactionModal