import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Category, Transaction, User, UserUpiCategoryNameMapping } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { deepEqualsObject } from '@/utils'

interface TransactionModelProps{
    transaction: Transaction | null
    onSave: (transaction: Transaction, categoryId?: string, vpaNickName?: string) => void
    open: boolean
    onOpenChange: (open: boolean) => void
    placeholder: string
    categories: Category[] | undefined
    isEditing: boolean
}

function TransactionModal({ transaction, onSave, open, onOpenChange, placeholder, categories, isEditing }: TransactionModelProps){
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(transaction || null)
  const [isTransactionChanged, setIsTransactionChanged] = useState<boolean>(false)
  const transactionMetaData = transaction?.userUpiCategoryNameMapping
  const transactionCategory = transactionMetaData?.category
  
    console.log(editedTransaction, 'editedtransaction')
    // console.log(selectedCategory, nickName, 'nickname', transactionMetaData, transactionCategory)

    useEffect(()=>{
      if(editedTransaction){ 
        const message = deepEqualsObject(editedTransaction, transaction)
        console.log(message, 'deepequals')
        setIsTransactionChanged(message)
      }
    },[editedTransaction])

    const handleSave = () => {
        if (!editedTransaction || isTransactionChanged) return;
        onSave(editedTransaction)
        onOpenChange(false)
    }
    // wrap this in usecallback
    
    function handleEditTransaction(e: React.ChangeEvent<HTMLInputElement> | string){
      setEditedTransaction((prev)=> {
        if(typeof e !== "string" && e.target?.id !== "upi_name"){
          console.log('hello from block', e.target.value)
          return {
            ...prev,
            [e.target.value]: e.target.value
          }
        }
        else if(typeof e !== "string" && e.target.id === "upi_name"){
          return {
            ...prev,
            userUpiCategoryNameMapping: {
              ...prev?.userUpiCategoryNameMapping,
              upi_name: e.target.value
            }
          }
        }
        else {
          return {
            ...prev,
            userUpiCategoryNameMapping: {
              ...prev?.userUpiCategoryNameMapping,
              category_id: e,
              category: categories?.find(cat => cat.id === e)
            }
          }
        }
      })
  }
    console.log(editedTransaction, 'editedtransaciton')
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
                id="transaction_type" 
                value={editedTransaction?.transaction_type} 
                onChange={handleEditTransaction}
                disabled={isEditing}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="transacted_at" 
                type="date" 
                value={editedTransaction?.transacted_at} 
                onChange={handleEditTransaction}
                disabled={isEditing}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={editedTransaction?.amount} 
                onChange={handleEditTransaction}
                disabled={isEditing}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleEditTransaction}>
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
              <Label htmlFor="upi_name">Nickname for 
                <span className="pl-1">
                    {transactionMetaData?.upi_id}
                    </span>
                </Label>
              <Input
                id="upi_name" 
                value={editedTransaction?.userUpiCategoryNameMapping?.upi_name}
                onChange={handleEditTransaction}
              />
              </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="transaction_metadata_id" 
                value={editedTransaction?.transaction_metadata_id} 
                onChange={handleEditTransaction}
              />
            </div>
            <Button disabled={isTransactionChanged} onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

export default TransactionModal