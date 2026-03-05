import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const location = useLocation()
  const { navigate, student } = useContext(AppContext)

  const isCourseListPage = location.pathname === '/courses'

  return (
    <nav className={`border-b border-gray-300 shadow-sm ${
      isCourseListPage ? 'bg-white' : 'bg-cyan-100/70 backdrop-blur-sm'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 items-center">

 
  <div className="flex justify-start">
    <img
      src={assets.logo}
      alt="Logo"
      className="w-8 md:w-10 lg:w-12 cursor-pointer"
      onClick={() => navigate('/')}
    />
  </div>

  
  <div className="hidden md:flex justify-center gap-8 text-gray-700 font-medium">
    <Link to="/" className="hover:text-blue-600 transition">
      Home
    </Link>

    <Link to="/about" className="hover:text-blue-600 transition">
      About
    </Link>

    <Link to="/course-list" className="hover:text-blue-600 transition">
      Courses
    </Link>

    <Link to="/contact" className="hover:text-blue-600 transition">
      Contact
    </Link>

    {student && (
      <Link
        to="/my-enrollments"
        className="hover:text-blue-600 transition"
      >
        My Courses
      </Link>
    )}

    {student && (
      <Link
        to="/profile"
        className="hover:text-blue-600 transition"
      >
        My Profile
      </Link>
    )}
  </div>

 
  <div className="flex justify-end items-center gap-4">

    {!student ? (
      <button
        onClick={() => navigate('/student/login')}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-full"
      >
        Create Account
      </button>
    ) : (
      <button
        onClick={() => {
          localStorage.removeItem("token")
          navigate("/")
          window.location.reload()
        }}
          className="px-4 py-2 rounded-lg 
             bg-red-500 text-white 
             hover:bg-red-600 
             transition duration-300 
             text-sm font-medium"
      >
        Logout
      </button>
    )}

  </div>

</div>
    </nav>
  )
}

export default Navbar