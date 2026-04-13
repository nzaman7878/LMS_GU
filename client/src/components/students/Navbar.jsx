import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const location = useLocation();
  const { navigate, student, logoutStudent } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isCourseListPage = location.pathname === "/courses";

  const navLinks = [
    { name: "Home", path: "/" },

    {
      name: student ? "My Courses" : "Courses",
      path: student ? "/my-enrollments" : "/course-list",
    },

  
    ...(student
      ? [{ name: "Dashboard", path: "/student/dashboard" }]
      : []),

    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`border-b border-gray-300 shadow-sm sticky top-0 z-50 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

    
        <img
          src={assets.logo}
          alt="logo"
          className="w-8 md:w-10 lg:w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-blue-600 transition ${
                location.pathname === link.path ? "text-blue-600" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 relative">
          {!student ? (
            <button
              onClick={() => navigate("/student/login")}
              className="bg-blue-600 hover:bg-blue-700 hidden md:block text-white px-5 py-2 rounded-full transition text-sm font-medium"
            >
              Create Account
            </button>
          ) : (
            <div className="relative">
             
              <img
                src={student?.image || assets.profile_img}
                alt="profile"
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full cursor-pointer border object-cover"
              />

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border text-sm">

                 
                  <Link
                    to="/student/dashboard"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/my-enrollments"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    My Courses
                  </Link>

                  <Link
                    to="/my-profile"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  {/* LOGOUT */}
                  <button
                    onClick={() => {
                      logoutStudent(); 
                    }}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <img
              src={menuOpen ? assets.cross_icon : assets.open_menu}
              alt="menu"
              className="w-6"
            />
          </button>
        </div>
      </div>


      {menuOpen && (
        <div className="md:hidden bg-cyan-100/70 border-t border-gray-300 px-6 py-4 space-y-4 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}

          {!student && (
            <button
              onClick={() => navigate("/student/login")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Create Account
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;