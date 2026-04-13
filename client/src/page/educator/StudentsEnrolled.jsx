import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify"; // Using toastify for consistency with your AppContext
import Loading from "../../components/students/Loading";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);

  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        // Reverse shows the newest enrollments at the top
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Enrolled Students</h2>
      
      <div className="max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-900 bg-gray-50 border-b border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-bold text-center hidden sm:table-cell w-16">
                  #
                </th>
                <th className="px-4 py-3 font-bold">Student Name</th>
                <th className="px-4 py-3 font-bold">Course Title</th>
                <th className="px-4 py-3 font-bold hidden sm:table-cell">
                  Enrollment Date
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-600 divide-y divide-gray-100">
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-center hidden sm:table-cell text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt={item.student.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-100"
                      />
                      <span className="truncate font-medium text-gray-800">
                        {item.student.name}
                      </span>
                    </td>

                    <td className="px-4 py-4 truncate">
                      {item.courseTitle}
                    </td>

                    <td className="px-4 py-4 hidden sm:table-cell text-gray-500">
                      {new Date(item.purchaseDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-10 text-center text-gray-400 italic">
                    No students have enrolled in your courses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsEnrolled;