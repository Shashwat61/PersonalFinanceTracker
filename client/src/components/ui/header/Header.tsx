import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

function Header({ title }: { title: string }){
return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
export default Header