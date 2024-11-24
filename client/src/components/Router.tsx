import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Transactions from '../screens/transactions/Transactions'
import FlexiBenefits from '../screens/bills/Bills'
import Home from '../screens/home/Home'




const router = createBrowserRouter([
    {
        path: '/app',
        element: <Home />,
    },
    {
        path: '/app/transactions',
        element: <Transactions/>
    },
    {
      path: '/app/bills',
      element: <FlexiBenefits/>
    }
])
function Router() {
  return (
    <RouterProvider router={router}/>
  )
}

export default Router