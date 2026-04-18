import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageStudents = () => {
  const { backendUrl } = useAppContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ 
    userId: '', name: '', email: '', mobile: '', gender: '', university: '', education: '', address: '' 
  });

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(`${backendUrl}/api/admin/all-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setStudents(data.students);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (student) => {
    setEditData({
      userId: student._id,
      name: student.name || '',
      email: student.email || '',
      mobile: student.mobile || '',
      gender: student.gender || '',
      university: student.university || '',
      education: student.education || '',
      address: student.address || ''
    });
    setShowModal(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(`${backendUrl}/api/admin/update-student`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        fetchStudents(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(`${backendUrl}/api/admin/delete-student`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        setStudents(prev => prev.filter(s => s._id !== userId));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Students</h2>
          <p className="text-sm text-gray-500 font-medium">
            Total Enrolled: <span className="text-indigo-600">{students.length}</span>
          </p>
        </div>
        
        <div className="relative">
          <input 
            type="text" placeholder="Search by name or email..." 
            className="border border-gray-300 px-4 py-2 pl-10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-4 px-6">Student Info</th>
              <th className="py-4 px-6">Contact & University</th>
              <th className="py-4 px-6">Enrolled Courses</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">Loading student records...</td></tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((item) => (
                <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
           
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-400 transition-all"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-200 uppercase">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{item.name}</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter mt-0.5">
                          {item.gender || 'Not Specified'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-gray-800 font-medium text-xs">{item.email}</p>
                    <p className="text-[11px] text-indigo-500 mt-0.5 font-medium">{item.university || 'No University'}</p>
                  </td>

              
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {item.enrolledCourses && item.enrolledCourses.length > 0 ? (
                        item.enrolledCourses.map((course, index) => (
                          <span 
                            key={index} 
                            className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap font-medium"
                          >
                            {course.courseTitle || "Unnamed Course"}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">No courses</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleUpdateClick(item)} 
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Edit Student"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete Student"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-20 text-gray-400 font-medium">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Edit Student Record</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Full Name</label>
                  <input className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Email</label>
                  <input className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Mobile</label>
                  <input className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={editData.mobile} onChange={(e) => setEditData({...editData, mobile: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Gender</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={editData.gender} onChange={(e) => setEditData({...editData, gender: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">University</label>
                <input className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={editData.university} onChange={(e) => setEditData({...editData, university: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Education</label>
                <input className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={editData.education} onChange={(e) => setEditData({...editData, education: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Residential Address</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows="2" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-md shadow-indigo-100">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;