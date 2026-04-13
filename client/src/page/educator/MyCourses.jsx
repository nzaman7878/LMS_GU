import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import axios from "axios";
import { toast } from "react-toastify"; 

const MyCourses = () => {
  const { currency, backendUrl, isEducator } = useContext(AppContext);

  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      
      const token = localStorage.getItem("educatorToken");

      if (!token) {
        toast.error("Educator session not found. Please login again.");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  if (!courses) return <Loading />;

  return (
    <div className='p-4 md:p-8 space-y-6'>
      <h2 className='text-xl font-semibold'>My Courses</h2>

      <div className='w-full bg-white rounded-lg shadow-sm border overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='bg-gray-50 text-gray-700 border-b'>
            <tr>
              <th className='px-4 py-3 font-medium'>Course</th>
              <th className='px-4 py-3 font-medium'>Earnings</th>
              <th className='px-4 py-3 font-medium'>Students</th>
              <th className='px-4 py-3 font-medium'>Published On</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 divide-y">
            {courses.length > 0 ? (
              courses.map((course) => {
                
                const earnings = Math.floor(
                  (course.enrolledStudents?.length || 0) *
                  (course.coursePrice - (course.discount * course.coursePrice) / 100)
                );

                return (
                  <tr key={course._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-14 h-10 object-cover rounded border"
                      />
                      <span className="truncate max-w-[200px] md:max-w-none font-medium text-gray-800">
                        {course.courseTitle}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {currency}{earnings.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-center md:text-left">
                      {course.enrolledStudents?.length || 0}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(course.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center text-gray-400">
                  You haven't created any courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCourses;