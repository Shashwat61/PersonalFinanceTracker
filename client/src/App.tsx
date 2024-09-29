
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import './App.css'
import { QUERY_STALE_TIME } from './utils/constants'
import Router from './components/Router'
import { UserContextProvider } from './contexts/UserContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      retry: false
    },
  },
})


function App() {
  return (
    <QueryClientProvider client = {queryClient}>
      <UserContextProvider>
      <Router/>
      </UserContextProvider>
      <ReactQueryDevtools buttonPosition="top-right" />
    </QueryClientProvider>    
  )
}

export default App
