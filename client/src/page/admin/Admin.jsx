import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Footer from '../../components/admin/Footer';

const Admin = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      
      <div className='flex flex-1'>
        
        <Sidebar />

        <div className='flex-1 flex flex-col'>
          <main className='p-6 flex-grow'>
            <Outlet />
          </main>
        </div>

      </div>

      <Footer />

    </div>
  );
};

export default Admin;