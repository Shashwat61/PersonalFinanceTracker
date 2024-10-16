import React from 'react'
import { NavLink, redirect } from 'react-router-dom'

interface SideBarListItemProps {
    name: string,
    icon: React.ReactNode,
    redirectLink: string
}

function SidebarListItem(props: SideBarListItemProps) {
  
  return (
    <NavLink to={props.redirectLink} className="flex cursor-pointer my-4">
      <div>
        {props.icon}
      </div>
      <div>
        {props.name}
      </div>
    </NavLink>
  )
}

export default SidebarListItem