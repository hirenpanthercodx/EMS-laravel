import React from 'react'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

function Main() {
  return (
    <div className='d-flex wrapper' style={{backgroundColor: '#fef4f4'}}>
      <div >
        <Sidebar/>
      </div>
      <div style={{width: '80%', height: '100vh', margin: 'auto'}}>
        <NavBar />
        <Outlet />
      </div>
    </div>
  )
}

export default Main