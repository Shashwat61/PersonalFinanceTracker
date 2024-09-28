import { sideBarList } from '../../../../utils'
import SidebarListItem from '../sidebarlistitem/SidebarListItem'

function SidebarList() {
  return (
    <div>
      
    {
      sideBarList.map(({id, name, icon: Icon, redirectLink})=> (
        <SidebarListItem key={id} name={name} icon={<Icon/>} redirectLink={redirectLink}/>
      )
    )
  }
  </div>
  )
}

export default SidebarList