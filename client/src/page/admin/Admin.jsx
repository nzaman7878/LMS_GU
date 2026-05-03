import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Footer from '../../components/admin/Footer';
import Navbar from '../../components/admin/Navbar'; 

const Admin = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      
  
      <Navbar />
      
  
      <div className='flex flex-1 overflow-hidden'>
        
        <Sidebar />

       
        <div className='flex-1 flex flex-col overflow-y-auto'>
          <main className='p-6 flex-grow'>
            <Outlet />
          </main>
          <Footer /> 
        </div>

      </div>

    </div>
  );
};

export default Admin;