import React from 'react'
import Sidebar from './Sidebar'
import Header from './ui/header/Header'

type LayoutProps = {
    children: React.ReactNode
}

function Layout(props: LayoutProps) {
  return (
    // <div>
    //   <Header title="FinTrack"/>
    // <div className="flex">
    //     {/* sidebar */}
    //     <Sidebar activePage='home'/>
    //     {props.children}
    //     {/* main */}
    // </div>
    // </div>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activePage={"home"} />
        <main className="flex-1 overflow-y-auto">
          <Header title={"FinTrack"} />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {props.children}
          </div>
        </main>
      </div>
  )
}

export default Layout