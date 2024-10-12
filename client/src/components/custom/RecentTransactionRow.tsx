import { Transaction } from '@/types'
import { CreditCard } from 'lucide-react'

interface RecentTransactionRowProps{
data: Transaction
}

function RecentTransactionRow({data}: RecentTransactionRowProps) {
  console.log(data,' data')
  return (
    <div className="flex items-center">
        <div className="flex items-center justify-center mr-3 rounded-full w-9 h-9 bg-primary/10">
            <CreditCard className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium">{data.transaction_type}</p>
            <p className="text-xs text-muted-foreground">{data.transacted_at}</p>
        </div>
        <div className={`text-sm font-medium ${data.transaction_type === "credit" ? 'text-green-600' : 'text-red-600'}`}>
            {data.amount > 0 ? '+' : ''}₹{Math.abs(data.amount).toFixed(2)}
        </div>
    </div>
  )
}

export default RecentTransactionRow