import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PlusCircle } from 'lucide-react'
import { Bank, UserBankMapping } from '@/types'
import BankSelect from './BankSelector'

interface BankModal {
    open: boolean
    onSave: (bankId: string, accountNumber: string) => void
    setOpen: (val: boolean) => void
    addingBankPending: boolean
    title: string
    subTitle: string
    userBankMappings: UserBankMapping[]
    bankSeedData: Bank[] | undefined
}
function BankModal({bankSeedData, open, onSave, setOpen, addingBankPending, title, subTitle}: BankModal) {
  const [accountNumber, setAccountNumber] = useState<string>('')
  const [selectedBankId, setSelectedBankId] = useState<string>('')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {subTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="bank" className="text-right">
              Bank
            </Label>
            <BankSelect bankSeedData={bankSeedData} onChange={setSelectedBankId} placeholder="All Bank Branches" />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="accountNumber" className="text-right">
              Account Number
            </Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="col-span-3"
              placeholder='Last 4 digits of bank account'
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          
          <Button onClick={()=> onSave(selectedBankId, accountNumber)} disabled={addingBankPending || (!accountNumber || !selectedBankId)}>
          {addingBankPending && <Loader2 className="z-10 w-4 h-4 mr-2 animate-spin" /> }
          Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default BankModal