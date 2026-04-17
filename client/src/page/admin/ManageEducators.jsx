import React from 'react'

const ManageEducators = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Educators</h2>
          <p className="text-sm text-gray-500">View and manage all registered instructors</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search educator..." 
            className="border px-4 py-2 rounded-md text-sm focus:outline-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="py-4 px-4 font-medium">Dr. Sahil Kumar</td>
              <td className="py-4 px-4">sahil@lms.com</td>
              <td className="py-4 px-4">12 April 2026</td>
              <td className="py-4 px-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Active</span>
              </td>
              <td className="py-4 px-4 text-center">
                <button className="text-red-500 hover:text-red-700 font-medium">Revoke Access</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageEducators