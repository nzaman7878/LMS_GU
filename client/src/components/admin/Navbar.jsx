import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
 
  const { setAdminToken } = useContext(AppContext);

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    if (setAdminToken) setAdminToken(null);
    toast.success("Admin Logged Out");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
       
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/admin")}>
          <img
            src={assets.logo}
            alt="logo"
            className="w-8 md:w-10 lg:w-12"
          />
          <span className="text-xl font-bold text-gray-800 hidden sm:block">
            LMS Admin Panel
          </span>
        </div>

   
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right mr-2">
            <span className="text-sm font-semibold text-gray-800">Administrator</span>
            <span className="text-xs text-green-500 font-medium">● Online</span>
          </div>
          
          <button
            onClick={adminLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg transition text-sm font-semibold flex items-center gap-2"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;