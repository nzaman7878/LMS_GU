import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {

  const [teacher, setTeacher] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const teacherData = localStorage.getItem("teacherData");

    if (teacherData) {
      setTeacher(JSON.parse(teacherData));
    }
  }, []);

  return (

    <nav className="border-b border-gray-300 shadow-sm bg-cyan-100/70 backdrop-blur-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

       
        <img
          src={assets.logo}
          alt="logo"
          className="w-8 md:w-10 lg:w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />

       
        <div className="flex items-center gap-4 relative">

          
          <p className="hidden sm:block text-gray-600 text-sm">
            Hi,{" "}
            <span className="font-semibold text-gray-800">
              {teacher ? teacher.name : "Teacher"}
            </span>
          </p>


          <div className="relative">

            <img
              src={teacher?.image || assets.profile_img}
              onClick={() => setOpenMenu(!openMenu)}
              className="w-9 h-9 rounded-full cursor-pointer border hover:scale-105 transition"
              alt="profile"
            />

            {/* Dropdown */}
            {openMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg text-sm">

                <Link
                  to="/teacher/dashboard"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/teacher/courses"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  My Courses
                </Link>

                <Link
                  to="/teacher/add-course"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  Add Course
                </Link>

                <button
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 transition"
                  onClick={() => {
                    localStorage.removeItem("teacherData");
                    navigate("/");
                    window.location.reload();
                  }}
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </nav>

  );
};

export default Navbar;