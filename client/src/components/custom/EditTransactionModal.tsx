import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Transaction } from '@/types'

interface TransactionModelProps{
    transaction: Transaction
    onSave: (transaction: Transaction) => void
    open: boolean
    onOpenChange: (open: boolean) => void
    placeholder: string
}

function EditTransactionModal({ transaction, onSave, open, onOpenChange, placeholder }: TransactionModelProps){
    const [editedTransaction, setEditedTransaction] = useState(transaction || null)
  
    React.useEffect(() => {
      if (transaction) {
        setEditedTransaction(transaction)
      }
    }, [transaction])
  
    const handleSave = () => {
      onSave(editedTransaction)
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
                value={editedTransaction.transaction_type} 
                onChange={(e) => setEditedTransaction({...editedTransaction, transaction_type: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={editedTransaction.transacted_at} 
                onChange={(e) => setEditedTransaction({...editedTransaction, transacted_at: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={editedTransaction.amount} 
                onChange={(e) => setEditedTransaction({...editedTransaction, amount: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={editedTransaction.category_id} 
                onChange={(e) => setEditedTransaction({...editedTransaction, category_id: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={editedTransaction.transaction_metadata_id} 
                onChange={(e) => setEditedTransaction({...editedTransaction, transaction_metadata_id: e.target.value})}
              />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

export default EditTransactionModal