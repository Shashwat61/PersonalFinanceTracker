import { getActivePage, sideBarList } from '@/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import { SideBarItem } from '@/types'
import usePersistentStorage from '@/hooks/usePersistentStorage'
import React from 'react'

function Sidebar() {
  const {pathname} = useLocation()
  const findActivePage = getActivePage(pathname)
  const [activePage, setActivePage] = usePersistentStorage<SideBarItem>({keyName: 'activePage', getFromLocalStorage: false, initialValue: findActivePage})
  const navigate = useNavigate()
  function handleActivePage(sideBarItem: SideBarItem){
    if(activePage.name !== sideBarItem.name){
      setActivePage(sideBarItem)
      navigate(sideBarItem.redirectLink)
    }
  }
  console.log('in sidebar')
  return (
    <aside className="w-64 bg-white shadow-md">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary">FinTrack</h1>
    </div>
    <nav className="mt-6">
      {sideBarList.map((item) => (
        <div
          key={item.name}
          onClick={() => handleActivePage(item)}
          className={`flex items-center px-6 py-3 cursor-pointer ${
            activePage?.name === item.name
              ? 'text-gray-700 bg-gray-200'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </div>
      ))}
    </nav>
  </aside>
  )
}

export default React.memo(Sidebar)