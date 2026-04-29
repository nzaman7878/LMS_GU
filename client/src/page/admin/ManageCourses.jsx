import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom'; 
const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { backendUrl } = React.useContext(AppContext); 
  
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('adminToken'); 
      
      const response = await axios.get(`${backendUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('adminToken');
        
        const response = await axios.delete(`${backendUrl}/api/admin/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          alert("Course deleted successfully!");
          setCourses(courses.filter(course => course._id !== courseId));
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course.");
      }
    }
  };

  const handleEdit = (courseId) => {
    
    navigate(`/admin/edit-course/${courseId}`);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading courses...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Courses</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600 uppercase text-sm bg-gray-50">
              <th className="py-3 px-4">Course Name</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-800">
                    {course.courseTitle}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {course.educator?.name || "Unknown Instructor"}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    ₹{course.coursePrice}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                     <span className={`px-2 py-1 text-xs rounded-full ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                     </span>
                  </td>
                  <td className="py-4 px-4 flex justify-center gap-3">
                    <button 
                      onClick={() => handleEdit(course._id)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;