import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { ArrowDownRight, ArrowUpRight, Edit2, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Transaction } from '@/types';
import { TRANSACTION_TYPES } from '@/utils/constants';
import { cn } from '@/utils';
interface TransactionSlabProps{
    transaction: Transaction
    onEdit: (transaction: Transaction) => void
    updateMutationPending: boolean
    similarTransactionsIds: string[]
    updateMutationSuccess: boolean
}
function TransactionSlab({ transaction, onEdit, similarTransactionsIds, updateMutationPending, updateMutationSuccess }: TransactionSlabProps) {
    const [expanded, setExpanded] = useState(false)
    const isTransactionDebit = transaction.transaction_type === TRANSACTION_TYPES.DEBIT
    const transactionMetaData = transaction?.userUpiCategoryNameMapping
    const transactionCategory = transactionMetaData?.category
    const isTransactionBeingUpdated = similarTransactionsIds.includes(transaction.id) && updateMutationPending
    useEffect(()=>{
       if(expanded && updateMutationSuccess){
              setExpanded(false)
       }
    },[updateMutationSuccess])
    
    return (
      <Card className={cn("mb-4 relative", isTransactionBeingUpdated && 'pointer-events-none opacity-50')} >
        {
            isTransactionBeingUpdated ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black rounded-lg bg-opacity-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        ) :null
        }
        <CardContent className="p-4">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!isTransactionDebit ? 'bg-green-100' : 'bg-red-100'}`}>
                {isTransactionDebit ? (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{transactionMetaData?.upi_name ? transactionMetaData?.upi_name :
                transactionMetaData?.upi_id}</h3>
                <p className="text-sm text-gray-500">{transaction?.transacted_at}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`font-bold ${!isTransactionDebit ? 'text-green-600' : 'text-red-600'}`}>
                {!isTransactionDebit ? '+' : ''}₹{Math.abs(transaction?.amount).toFixed(2)}
              </span>
              <Badge variant="outline" className="mt-1">
                {transactionCategory ? transactionCategory.name : "Category"}
              </Badge>
            </div>
          </div>
          {expanded && (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Description:</span> {transaction?.transaction_metadata_id}</p>
              {/* <p><span className="font-medium">Balance after transaction:</span> ₹{transaction.amount.toFixed(2)}</p> */}
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(transaction); }}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit Transaction
              </Button>
              <Badge variant="outline" className="mt-1">
                {transaction.mode}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

export default TransactionSlab