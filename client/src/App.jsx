import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './page/student/Home'
import CourseList from './page/student/CourseList'
import CourseDetails from './page/student/CourseDetails'
import MyProfile from './page/student/MyProfile'
import MyEnrollments from './page/student/MyEnrollments'
import Player from './page/student/Player'
import Loading from './components/students/Loading'
import About from './components/students/About'
import Contact from './components/students/Contact'

import Educator from './page/educator/Educator'
import EducatorDashboard from './page/educator/EducatorDashboard'
import AddCourse from './page/educator/AddCourse'
import MyCourses from './page/educator/MyCourses'
import StudentsEnrolled from './page/educator/StudentsEnrolled'

import AdminLogin from './page/admin/AdminLogin'
import Admin from './page/admin/Admin'
import AdminDashboard from './page/admin/AdminDashboard'
import AddEducators from './page/admin/AddEducators'
import ManageCourses from './page/admin/ManageCourses'
import ManageStudents from './page/admin/ManageStudents'
import ManageEducators from './page/admin/ManageEducators'

import Navbar from './components/students/Navbar'
import StudentLogin from './page/student/StudentLogin'
import StudentDashboard from './page/student/StudentDashboard'
import { ToastContainer } from 'react-toastify';

import "quill/dist/quill.snow.css";


function App() {

  const location = useLocation();

  const isEducatorRoute = location.pathname.startsWith('/educator');

  return (
    <div className="text-default min-h-screen bg-white">
        <ToastContainer />

      {!isEducatorRoute && <Navbar />}

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/student/login' element={<StudentLogin />} />
        <Route path='/student/dashboard' element={<StudentDashboard />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course-list/:searchTerm' element={<CourseList />} />
        <Route path='/courses/:id' element={<CourseDetails />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />

        <Route path='/educator' element={<Educator />} >
          <Route index element={<EducatorDashboard />} />
          <Route path='dashboard' element={<EducatorDashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='students-enrolled' element={<StudentsEnrolled />} />
        </Route>

       <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/admin' element={<Admin />} >
          <Route index element={<AdminDashboard />} />
           <Route path='add-educators' element={<AddEducators />} />
          <Route path='manage-courses' element={<ManageCourses />} />
          <Route path='manage-students' element={<ManageStudents />} />
          <Route path='manage-educators' element={<ManageEducators />} />
        </Route>

        <Route path='*' element={<h1>404 Not Found</h1>} />

      </Routes>
    </div>
  )
}

export default App;