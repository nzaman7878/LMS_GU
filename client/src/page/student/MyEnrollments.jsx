import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/students/Footer";

const MyEnrollments = () => {

  const { enrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext);

  const [progressArray] = useState([
    { courseId: 1, completedLectures: 4, totalLectures: 10 }

  ]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">

        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">

          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Complete</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">

            {enrolledCourses?.map((course, index) => {

              const completed = progressArray[index]?.completedLectures || 0;
              const total = progressArray[index]?.totalLectures || 0;
              const percent = total ? (completed / total) * 100 : 0;

              return (
                <tr className="border-b border-gray-500/20" key={course._id || index}>

                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">

                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-14 sm:w-24 md:w-28"
                    />

                    <div className="flex-1">

                      <p className="mb-1 max-sm:text-sm">
                        {course.courseTitle}
                      </p>

                      <Line
                        percent={percent}
                        strokeWidth={4}
                        strokeColor="#3b82f6"
                        className="!h-1 rounded-full"
                      />

                    </div>

                  </td>

                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="px-4 py-3 max-sm:hidden">
                    {completed} / {total} <span>Lectures</span>
                  </td>

                  <td className="px-4 py-3 max-sm:text-right">

                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white rounded max-sm:text-xs"
                    >
                      {completed === total ? "Completed" : "On Going"}
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;