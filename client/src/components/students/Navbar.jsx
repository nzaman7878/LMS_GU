import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Navbar = () => {

  const location = useLocation()
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
        />

      
        <div className="hidden md:flex items-center gap-6 text-gray-600">

          <button className="hover:text-blue-600 transition">
            Teacher
          </button>

          <Link
            to="/my-enrollments"
            className="hover:text-blue-600 transition"
          >
            My Enrollments
          </Link>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-full">
            Create Account
          </button>

        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4 text-gray-600">

          <Link to="/my-enrollments" className="text-sm">
            Enrollments
          </Link>

          <button>
            <img
              src={assets.user_icon}
              alt="User"
              className="w-6"
            />
          </button>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
