
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import './App.css'
import { QUERY_STALE_TIME } from './utils/constants'
import Router from './components/Router'
import { UserContextProvider } from './contexts/UserContext'
import { BankContextProvider } from './contexts/BankContext'
import toast, { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    }
  })
})


function App() {
  return (
    <QueryClientProvider client = {queryClient}>
      <UserContextProvider>
        <BankContextProvider>
      <Router/>
        </BankContextProvider>
      </UserContextProvider>
      <ReactQueryDevtools buttonPosition="top-right" />
      <Toaster/>
    </QueryClientProvider>    
  )
}

export default App
