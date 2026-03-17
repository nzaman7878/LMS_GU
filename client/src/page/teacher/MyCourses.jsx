import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/students/Loading';

const MyCourses = () => {
  const { currency, allcourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchTeacherCourses = async () => {
    setCourses(allcourses);
  };

  useEffect(() => {
    fetchTeacherCourses();
  }, [allcourses]);

  if (!courses) return <Loading />;

  return (
    <div className='p-4 md:p-8 space-y-6'>

      <h2 className='text-xl font-semibold'>My Courses</h2>

 
      <div className='w-full bg-white rounded-lg shadow-sm border overflow-x-auto'>
        
        <table className='w-full text-sm text-left'>
          
         
          <thead className='bg-gray-50 text-gray-700'>
            <tr>
              <th className='px-4 py-3'>Course</th>
              <th className='px-4 py-3'>Earnings</th>
              <th className='px-4 py-3'>Students</th>
              <th className='px-4 py-3'>Published</th>
            </tr>
          </thead>

      
          <tbody className="text-gray-600">
            {courses.map((course) => {

              const earnings = Math.floor(
                course.enrolledStudents.length *
                (course.coursePrice -
                  (course.discount * course.coursePrice) / 100)
              );

              return (
                <tr
                  key={course._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                 
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-14 h-10 object-cover rounded"
                    />
                    <span className="hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>

                
                  <td className="px-4 py-3">
                    {currency}{earnings}
                  </td>

                
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MyCourses;