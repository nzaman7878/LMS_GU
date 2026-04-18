

const ManageStudents = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Students</h2>
          <p className="text-sm text-gray-500">Total registered students in the system</p>
        </div>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="border px-4 py-2 rounded-md text-sm focus:outline-indigo-500 w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Courses Enrolled</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="py-4 px-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">A</div>
                Aman Gupta
              </td>
              <td className="py-4 px-4">aman@gmail.com</td>
              <td className="py-4 px-4">4 Courses</td>
              <td className="py-4 px-4">2 hours ago</td>
              <td className="py-4 px-4 text-center">
                <button className="text-blue-600 hover:underline mr-3">Update</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageStudents