import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AddTransaction, Category, Transaction } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { deepEqualsObject } from '@/utils'

interface TransactionModelProps{
    transaction: Transaction | null
    onSave: (transaction: Transaction | AddTransaction) => void
    open: boolean
    onOpenChange: (open: boolean) => void
    placeholder: string
    categories: Category[] | undefined
    isEditing: boolean
}

function TransactionModal({ transaction, onSave, open, onOpenChange, placeholder, categories, isEditing }: TransactionModelProps){
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(transaction || null)
  const [isTransactionChanged, setIsTransactionChanged] = useState<boolean>(false)
  const transactionMetaData = editedTransaction?.userUpiCategoryNameMapping
  const transactionCategory = transactionMetaData?.category

    useEffect(()=>{
      if(editedTransaction){ 
        const message = deepEqualsObject(editedTransaction, transaction)
        setIsTransactionChanged(message)
      }
    },[editedTransaction])

    function handleSave(){
        if (!editedTransaction || isTransactionChanged) return;
        onSave(editedTransaction)
        onOpenChange(false)
    }
    
    function handleEditTransaction(e: React.ChangeEvent<HTMLInputElement> | string){
      setEditedTransaction((prev)=> {
        console.log(prev, 'previous value')
        if(typeof e !== "string" && e.target.id === "upi_id"){
          return {
            ...prev,
            userUpiCategoryNameMapping: {
              ...prev?.userUpiCategoryNameMapping,
              upi_id: e.target.value
            }
          }
        }
        else if(typeof e !== "string" && e.target?.id !== "upi_name"){
          console.log('hello from block', e.target.value)
          return {
            ...prev,
            [e.target.id]: e.target.value
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
    console.log(!!transactionMetaData?.upi_id, 'boolean')
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
              <Label aria-required={true}  htmlFor="category">Category</Label>
              <Select required={true} onValueChange={handleEditTransaction}>
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
            { isEditing ?
              (<div>
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
              </div>)
              : (
                <>
                <div>
                  <Label htmlFor='upi_id'>UPI Id</Label>
                  <Input
                  id="upi_id"
                  value={editedTransaction?.userUpiCategoryNameMapping?.upi_id}
                  onChange={handleEditTransaction}
                  />
                  </div>
                  <div>
                  <Label htmlFor="upi_name">Nickname for 
                <span  className="pl-1">
                    {transactionMetaData?.upi_id}
                    </span>
                </Label>
              <Input
                disabled={!transactionMetaData?.upi_id}
                id="upi_name" 
                value={editedTransaction?.userUpiCategoryNameMapping?.upi_name}
                onChange={handleEditTransaction}
              />
                  </div>
                  </>
              )
            }
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