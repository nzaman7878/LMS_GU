import React from 'react';

const AdminDashboard = () => {
  
  const stats = [
    { label: 'Total Courses', value: '24', color: 'bg-blue-500' },
    { label: 'Total Students', value: '1,250', color: 'bg-green-500' },
    { label: 'Total Teachers', value: '45', color: 'bg-purple-500' },
    { label: 'Total Revenue', value: '₹1,50,000', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-700 mb-6'>Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((item, index) => (
          <div key={index} className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500'>
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