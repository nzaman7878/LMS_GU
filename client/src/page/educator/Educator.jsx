import React from 'react';
import Navbar from '../../components/educator/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/educator/Sidebar';
import Footer from '../../components/educator/Footer';

const Educator = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='flex'>
        <Sidebar />

        <div className='flex-1 p-4 md:p-6'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;