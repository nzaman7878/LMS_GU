import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const location = useLocation()
  const {navigate} = useContext(AppContext)

  const isCourseListPage = location.pathname === '/courses'

  return (
    <nav className={`border-b border-gray-300 ${
      isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        <img
          src={assets.logo}
          alt="Logo"
          className="w-8 md:w-10 lg:w-12 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <div className="hidden md:flex items-center gap-6 text-gray-600">

          <button 
            onClick={() => navigate('/teacher')}
            className="hover:text-blue-600 transition"
          >
            Teacher
          </button>

          <Link
            to="/my-enrollments"
            className="hover:text-blue-600 transition"
          >
            My Enrollments
          </Link>

          
          <button
            onClick={() => navigate('/student/login')}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>

        </div>

      </div>
    </nav>
  )
}

export default Navbar