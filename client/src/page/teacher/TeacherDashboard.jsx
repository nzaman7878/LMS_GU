import React from 'react';

const TeacherDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white shadow rounded-lg p-4 border">
          <h2 className="text-gray-600">Total Courses</h2>
          <p className="text-xl font-bold mt-2">5</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border">
          <h2 className="text-gray-600">Students Enrolled</h2>
          <p className="text-xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border">
          <h2 className="text-gray-600">Revenue</h2>
          <p className="text-xl font-bold mt-2">₹12,000</p>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;