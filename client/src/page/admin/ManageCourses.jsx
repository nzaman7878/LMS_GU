import React from 'react';

const ManageCourses = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Courses</h2>
        
      </div>
      
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600 uppercase text-sm">
              <th className="py-3 px-4">Course Name</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-4 px-4">React Mastery</td>
              <td className="py-4 px-4">John Doe</td>
              <td className="py-4 px-4">₹4,999</td>
              <td className="py-4 px-4">
                <button className="text-blue-600 hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;