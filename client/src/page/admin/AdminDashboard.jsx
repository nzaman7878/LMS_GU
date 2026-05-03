import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext'; 
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../../components/students/Navbar';

const AdminDashboard = () => {
  const { backendUrl, currency } = useContext(AppContext);
  const navigate = useNavigate(); 
  
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEducators: 0,
    totalRevenue: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setDashboardData(data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [backendUrl]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN'); 
  };


  const stats = [
    { label: 'Total Courses', value: formatNumber(dashboardData.totalCourses), color: 'bg-blue-500', path: '/admin/manage-courses' },
    { label: 'Total Students', value: formatNumber(dashboardData.totalStudents), color: 'bg-green-500', path: '/admin/manage-students' },
    { label: 'Total Teachers', value: formatNumber(dashboardData.totalEducators), color: 'bg-purple-500', path: '/admin/manage-educators' },
    { label: 'Total Revenue', value: `${currency}${formatNumber(dashboardData.totalRevenue)}`, color: 'bg-orange-500' }, // No path for revenue (unless you have a reports page)
  ];

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <div>
    
      <h2 className='text-2xl font-bold text-gray-700 mb-6'>Dashboard Overview</h2>
      
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((item, index) => (
          <div 
            key={index} 
            
            onClick={() => {
                if (item.path) {
                    navigate(item.path);
                }
            }}
           
            className={`bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500 transition-transform hover:-translate-y-1 ${item.path ? 'cursor-pointer hover:shadow-md' : ''}`}
          >
            <p className='text-sm text-gray-500 uppercase font-bold'>{item.label}</p>
            <p className='text-3xl font-semibold text-gray-800 mt-2'>{item.value}</p>
          </div>
        ))}
      </div>

      <div className='mt-10 bg-white p-6 rounded-xl shadow-sm'>
        <h3 className='text-lg font-bold text-gray-700 mb-4'>Recent Enrollments</h3>
        <div className='border-t border-gray-100 pt-4 text-gray-500 text-center italic'>
          Database connection established. Real-time data will appear here.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;