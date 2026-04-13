
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import StudentLayout from "../../components/students/StudentLayout";
import { BookOpen, PlayCircle, Clock, User, LogOut, ChevronRight } from "lucide-react";

const StudentDashboard = () => {
  const {
    logoutStudent,
    student,
    enrolledCourses,
    calculateCourseDuration,
    calculateNoOfLectures
  } = useAppContext();

  const navigate = useNavigate();

  const totalLectures = enrolledCourses.reduce((acc, course) => acc + calculateNoOfLectures(course), 0);

  return (
    <StudentLayout>
      <div className="py-6">
       
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {student?.name?.split(" ")[0] || "Student"}! 
            </h1>
            <p className="text-gray-500 mt-1">Check your progress and continue learning.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-profile")} 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
            >
              <User size={18} />
              Profile
            </button>
            <button
              onClick={logoutStudent}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={<BookOpen className="text-blue-600" />} 
            label="Enrolled Courses" 
            value={enrolledCourses.length} 
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon={<PlayCircle className="text-purple-600" />} 
            label="Total Lectures" 
            value={totalLectures} 
            bgColor="bg-purple-50"
          />
          <StatCard 
            icon={<Clock className="text-orange-600" />} 
            label="Duration" 
            value={enrolledCourses.length > 0 ? calculateCourseDuration(enrolledCourses[0]) : "0h"} 
            bgColor="bg-orange-50"
          />
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Courses</h2>
            <button 
              onClick={() => navigate("/my-enrollments")} 
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
              <button 
                onClick={() => navigate("/course-list")}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  onClick={() => navigate(`/player/${course._id}`)} 
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img 
                        src={course.courseThumbnail} 
                        alt={course.courseTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.courseTitle}
                    </h3>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <PlayCircle size={14} /> {calculateNoOfLectures(course)} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {calculateCourseDuration(course)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

const StatCard = ({ icon, label, value, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default StudentDashboard;