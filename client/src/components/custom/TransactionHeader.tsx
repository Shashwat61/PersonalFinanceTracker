import React, { Dispatch, SetStateAction } from 'react'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Filter, Search } from 'lucide-react'
import { Input } from '../ui/input'
import DatePicker from './DatePicker'
interface TransactionHeaderProps{
    search: string
    setSearch: (val: string) => void
    selectedDate: Date | undefined
    setSelectedDate: Dispatch<SetStateAction<Date>>
}
function TransactionHeader({selectedDate, setSelectedDate, setSearch}: TransactionHeaderProps) {
  return (
    <div>
        <div className="flex flex-col items-start justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="flex items-center w-full sm:w-auto">
                <Input placeholder="Search transactions..." className="mr-2" onChange={(e)=> setSearch(e.target.value)} />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4"  />
                </Button>
              </div>
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
              <div className="flex items-center w-full space-x-2 sm:w-auto">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="3-months">Last 3 Months</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex mb-6 space-x-2">
              <Badge variant="secondary" className="cursor-pointer">All</Badge>
              <Badge variant="outline" className="cursor-pointer">Income</Badge>
              <Badge variant="outline" className="cursor-pointer">Expenses</Badge>
            </div>
    </div>
  )
}

export default TransactionHeader