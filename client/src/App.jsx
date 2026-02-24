import './App.css'
import { Routes, Route, useMatch } from 'react-router-dom'

import Home from './components/students/Hero'
import CourseList from './page/student/CourseList'
import CourseDetails from './page/student/CourseDetails'
import MyEnrollments from './page/student/MyEnrollments'
import Player from './page/student/Player'
import Loading from './components/students/Loading'

import Teacher from './page/teacher/Teacher'
import TeacherDashboard from './page/teacher/TeacherDashboard'
import AddCourse from './page/teacher/AddCourse'
import MyCourses from './page/teacher/MyCourses'
import StudentsEnrolled from './page/teacher/StudentsEnrolled'

import Admin from './page/admin/Admin'
import AdminDashboard from './page/admin/AdminDashboard'
import ManageCourses from './page/admin/ManageCourses'
import ManageStudents from './page/admin/ManageStudents'
import ManageTeachers from './page/admin/ManageTeachers'
import Navbar from './components/students/Navbar'
import StudentLogin from './page/student/StudentLogin'
import StudentDashboard from './page/student/StudentDashboard'
import { useLocation } from 'react-router-dom';

function App() {

const location = useLocation();
const isTeacherRoute = location.pathname.startsWith('/teacher');
  return (
    <div className="text-default min-h-screen bg-white">

     {!isTeacherRoute && <Navbar />}

      <Routes>

      
      <Route path='/' element={<Home />} />
      <Route path='/student/login' element={<StudentLogin />} />
      <Route path='/student/dashboard' element={<StudentDashboard />} />
      <Route path='/course-list/:searchTerm' element={<CourseList />} />
      <Route path='/courses/:id' element={<CourseDetails />} />
      <Route path='/my-enrollments' element={<MyEnrollments />} />
      <Route path='/player/:courseId' element={<Player />} />
      <Route path='/loading' element={<Loading />} />

      
      <Route path='/teacher' element={<Teacher />} >
        <Route index element={<TeacherDashboard />} />
        <Route path='add-course' element={<AddCourse />} />
        <Route path='my-courses' element={<MyCourses />} />
        <Route path='student-enrolled' element={<StudentsEnrolled />} />
      </Route>

     
      <Route path='/admin' element={<Admin />} >
        <Route index element={<AdminDashboard />} />
        <Route path='manage-courses' element={<ManageCourses />} />
        <Route path='manage-students' element={<ManageStudents />} />
        <Route path='manage-teachers' element={<ManageTeachers />} />
      </Route>

      {/* 404 */}
      <Route path='*' element={<h1>404 Not Found</h1>} />

    </Routes>
    </div>
  )
}

export default App
