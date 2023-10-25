import React from 'react'
import "./CuratorNavData"
import { CuratorNavData } from './CuratorNavData';
import "../AccountNav.css"

function CuratorNav() {

  return (

    <div className='SideBar'> 

      <div className='Profile'>

        <h2>Curator</h2>
      
      </div>

      <ul className='SideBarList'>
        {CuratorNavData.map ((val, key) => {
          return ( 
            <li key={key} 
            className='SideBarRow'


            // color stay wherever the current pathname
            id={window.location.pathname === val.link ? "active" : ""}
            onClick = {() => {
              
              // change path when clicking
              window.location.pathname = val.link
                }
              }>
              <div id='icon'>{val.icon}</div>
              <div id='title'>{val.title}</div>
            </li>
          )
      })}
      </ul>
    </div>
  )
}

export default CuratorNav