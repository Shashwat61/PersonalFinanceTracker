import { useState } from 'react'
import { Upload, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WithLayout from '@/components/WithLayout'

function FlexiBenefits() {
  const [bills] = useState([
    { id: 1, name: 'WiFi Bill', date: '2023-06-28', amount: 1000, category: 'WiFi' },
    { id: 2, name: 'Petrol Expense', date: '2023-06-27', amount: 1500, category: 'Petrol' },
    { id: 3, name: 'Online Course', date: '2023-06-26', amount: 2000, category: 'Course' },
    { id: 4, name: 'Health Checkup', date: '2023-06-25', amount: 2500, category: 'Health' },
  ])

  return (
    
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Benefits Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['WiFi', 'Petrol', 'Course', 'Health', 'Food'].map((category, index) => (
                <div key={category}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{category}</span>
                    <span>{20 + index * 15}%</span>
                  </div>
                  <Progress value={20 + index * 15} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Bill */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select benefit category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wifi">WiFi</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                </SelectContent>
              </Select>
              <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">Drag and drop your bill here, or click to select a file</p>
              </div>
              <Input type="file" className="hidden" id="bill-upload" />
              <Button className="w-full" onClick={() => document.getElementById('bill-upload')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Bill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bills */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Bills</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Bill Name</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="border-b last:border-b-0">
                      <td className="py-3">{bill.name}</td>
                      <td className="py-3">{bill.category}</td>
                      <td className="py-3">{bill.date}</td>
                      <td className="py-3">₹{bill.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}
export default WithLayout(FlexiBenefits)