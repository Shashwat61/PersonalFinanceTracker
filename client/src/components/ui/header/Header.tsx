import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu"
import { SyntheticEvent } from "react"
import { logout } from "@/lib/auth"
import toast from "react-hot-toast"

function Header({ title }: { title: string }){
  function handleClick(e: SyntheticEvent<HTMLElement>){
    e.preventDefault();
    console.log('clicked', (e.target as HTMLElement).dataset.name)
    switch ((e.target as HTMLElement).dataset.name) {
      case "profile":
        console.log('profile')
        break;
      case "logout":
        console.log('logout')
        handleLogout()
        break;
      default:
        break;
    }
  }
  async function handleLogout(){
    try{ 
      await logout()
      window.location.href = "/"
    }
    catch(e){
      console.log((e as Error).message)
      toast.error("Something went wrong")
    }
  }
return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={handleClick}>
              <DropdownMenuItem data-name="profile">Profile</DropdownMenuItem>
              <DropdownMenuItem data-name="logout">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
export default Header