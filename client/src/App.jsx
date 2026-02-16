import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './page/student/Home'
import CourseList from './page/student/CourseList'
import CourseDetails from './page/student/CourseDetails'
import MyEnrollments from './page/student/MyEnrollments'
import Player from './page/student/Player'
import Loading from './components/students/Loading'

function App() {

  return (
    <Routes>

      <Route path='/' element={<Home />} />

      <Route path='/courses' element={<CourseList />} />
      <Route path='/courses/:id' element={<CourseDetails />} />

      <Route path='/my-enrollments' element={<MyEnrollments />} />
      <Route path='/player/:courseId' element={<Player />} />

      <Route path='/loading' element={<Loading />} />

      <Route path='*' element={<h1>404 Not Found</h1>} />

    </Routes>
  )
}

export default App
