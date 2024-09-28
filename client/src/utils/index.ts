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