import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"; // Import Context

const Navbar = () => {

  const { educatorData, setEducatorData, setIsEducator } = useContext(AppContext);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("educatorToken");
    localStorage.removeItem("educatorData");
    setEducatorData(null); 
    setIsEducator(false);
    navigate("/student/login"); 
  };

  const closeMenu = () => setOpenMenu(false);

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
            Hi, <span className="font-semibold text-gray-800">
              {educatorData ? educatorData.name : "Guest"}
            </span>
          </p>

          <div className="relative">
            <img
      
              src={educatorData?.image || assets.profile_img}
              onClick={() => setOpenMenu(!openMenu)}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-sm hover:scale-105 transition-all object-cover"
              alt="profile"
            />

            {openMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 text-sm text-gray-700 animate-in fade-in zoom-in duration-200">
                <Link to="/educator/dashboard" onClick={closeMenu} className="block px-4 py-2.5 hover:bg-cyan-50 hover:text-cyan-600 transition">Dashboard</Link>
                <Link to="/educator/my-profile" onClick={closeMenu} className="block px-4 py-2.5 hover:bg-cyan-50 hover:text-cyan-600 transition">My Profile</Link>
                <Link to="/educator/my-courses" onClick={closeMenu} className="block px-4 py-2.5 hover:bg-cyan-50 hover:text-cyan-600 transition">My Courses</Link>
                <Link to="/educator/add-course" onClick={closeMenu} className="block px-4 py-2.5 hover:bg-cyan-50 hover:text-cyan-600 transition">Add Course</Link>
                <hr className="my-1 border-gray-100" />
                <button className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 transition font-medium" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;