import React from 'react'
import Sidebar from './Sidebar'
import Header from './ui/header/Header'

type LayoutProps = {
    children: React.ReactNode
}

function Layout(props: LayoutProps) {
  return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header title={""} />
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {props.children}
          </div>
        </main>
      </div>
  )
}

export default React.memo(Layout)