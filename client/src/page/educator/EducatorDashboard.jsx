import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/students/Loading";
import axios from "axios";
import { toast } from "react-toastify"; 

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 bg-gray-50/50">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     
        <div className="flex items-center gap-4 p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img src={assets.patients_icon} className="w-12" alt="Enrollments" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Total Enrolments
            </p>
          </div>
        </div>

       
        <div className="flex items-center gap-4 p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img src={assets.appointments_icon} className="w-12" alt="Courses" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashboardData.totalCourses}
            </p>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Total Courses
            </p>
          </div>
        </div>

       
        <div className="flex items-center gap-4 p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img src={assets.earning_icon} className="w-12" alt="Earnings" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {currency}
              {dashboardData.totalEarnings.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Total Earnings
            </p>
          </div>
        </div>
      </div>

     
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Latest Enrolments</h2>
          <button 
            onClick={() => window.location.href = '/educator/students-enrolled'} 
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-center w-16">#</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course Name</th>
              </tr>
            </thead>

            <tbody className="text-gray-600 divide-y">
              {dashboardData.enrolledStudentsData.length > 0 ? (
                dashboardData.enrolledStudentsData.slice(0, 5).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-center text-gray-400 font-medium">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt={item.student.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                      <span className="font-semibold text-gray-800">
                        {item.student.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-600">
                      {item.courseTitle}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">
                    No enrollments yet. Start sharing your courses!
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

export default Dashboard;