import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/students/Loading';

const TeacherDashboard = () => {

  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    setDashboardData(dummyDashboardData);
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className='min-h-screen p-4 md:p-8 space-y-8'>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

      
        <div className='flex items-center gap-4 p-5 bg-white border rounded-lg shadow-sm'>
          <img src={assets.patients_icon} className='w-10' alt="" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className='text-gray-500 text-sm'>Total Enrolments</p>
          </div>
        </div>

        
        <div className='flex items-center gap-4 p-5 bg-white border rounded-lg shadow-sm'>
          <img src={assets.appointments_icon} className='w-10' alt="" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>
              {dashboardData.totalCourses}
            </p>
            <p className='text-gray-500 text-sm'>Total Courses</p>
          </div>
        </div>

   
        <div className='flex items-center gap-4 p-5 bg-white border rounded-lg shadow-sm'>
          <img src={assets.earning_icon} className='w-10' alt="" />
          <div>
            <p className='text-2xl font-semibold text-gray-700'>
              {currency}{dashboardData.totalEarnings}
            </p>
            <p className='text-gray-500 text-sm'>Total Earnings</p>
          </div>
        </div>

      </div>

    
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>

        <h2 className='text-lg font-semibold p-4 border-b'>
          Latest Enrolments
        </h2>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            
            <thead className='bg-gray-50 text-gray-700'>
              <tr>
                <th className='px-4 py-3 text-center'>#</th>
                <th className='px-4 py-3'>Student</th>
                <th className='px-4 py-3 text-center'>Course</th>
              </tr>
            </thead>

            <tbody className='text-gray-600'>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr
                  key={index}
                  className='border-t hover:bg-gray-50 transition'
                >
                  <td className='px-4 py-3 text-center'>
                    {index + 1}
                  </td>

                  <td className='px-4 py-3 flex items-center gap-3'>
                    <img
                      src={item.student.imageUrl}
                      alt=""
                      className='w-9 h-9 rounded-full object-cover'
                    />
                    <span>{item.student.name}</span>
                  </td>

                  <td className='px-4 py-3 text-center'>
                    {item.courseTitle}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default TeacherDashboard;