import React from 'react'
import { sideBarList } from '@/utils'
import { NavLink } from 'react-router-dom'

function Sidebar({activePage}: {activePage: string}) {
  return (
    <aside className="w-64 bg-white shadow-md">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary">FinTrack</h1>
    </div>
    <nav className="mt-6">
      {sideBarList.map((item) => (
        <NavLink
          key={item.name}
          to={item.redirectLink}
          className={`flex items-center px-6 py-3 ${
            activePage === item.name.toLowerCase()
              ? 'text-gray-700 bg-gray-200'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  </aside>
  )
}

export default Sidebar