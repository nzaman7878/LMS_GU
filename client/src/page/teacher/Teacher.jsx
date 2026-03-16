import React from 'react'
import Navbar from '../../components/teacher/Navbar'
import { Outlet } from 'react-router-dom'

const Teacher = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
 <Navbar />
      <div>
<Outlet />
      </div>
    </div>
  )
}

export default Teacher