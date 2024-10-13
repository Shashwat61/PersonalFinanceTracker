import { clsx, type ClassValue } from "clsx"
import { HomeIcon, Package2Icon, WalletIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const sideBarList = [
  {
    id: 1,
    name: "Dashboard",
    icon: HomeIcon,
    redirectLink: '/'
  },
  {
    id: 2,
    name: "Transactions",
    icon: WalletIcon,
    redirectLink: '/transactions'
  },
  {
    id: 3,
    name: "Bills",
    icon: Package2Icon,
    redirectLink: '/bills'
  },
]

export function getCookie(key: string) {
  const cookies = document.cookie.split(";")
  const cookie = cookies.find(cookie => cookie.replace(/=.+$/, "")?.trim() === key)
  return cookie?.split("=")[1] || ""
}

export function appendParamsInUrl(...args: Record<string, any>[]){
  console.log(args)
  const urlSearchParams = new URLSearchParams()
  args.forEach((arg)=>{
    for(const key in arg){
      urlSearchParams.append(key, arg[key].toString())
    }
  })
  return urlSearchParams
}

export function getDates(selectedDate: Date){
  const after = `${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()}`
  const beforeDateTime = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  const before = `${beforeDateTime.getFullYear()}-${beforeDateTime.getMonth()+1}-${beforeDateTime.getDate()}`
  return {after, before}
}