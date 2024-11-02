import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Transactions from '../screens/transactions/Transactions'
import FlexiBenefits from '../screens/bills/Bills'
import Home from '../screens/home/Home'




const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/transactions',
        element: <Transactions/>
    },
    {
      path: '/bills',
      element: <FlexiBenefits/>
    }
])
function Router() {
  return (
    <RouterProvider router={router}/>
  )
}

export default Router