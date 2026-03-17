import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets.js';

const Sidebar = () => {

  const { isTeacher } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: assets.home_icon },
    { name: 'Add Course', path: '/teacher/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/teacher/my-courses', icon: assets.my_courses_icon },
    { name: 'Students', path: '/teacher/student-enrolled', icon: assets.person_tick_icon }
  ];

  if (!isTeacher) return null;

  return (
    <div className="md:w-64 w-16 bg-white border-r shadow-sm min-h-screen flex flex-col">

      
      <div className="hidden md:flex items-center justify-center h-16 border-b">
        <h1 className="text-lg font-bold text-indigo-600">Teacher Panel</h1>
      </div>

      
      <div className="flex flex-col gap-1 mt-4 px-2">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <img
              src={item.icon}
              alt=""
              className="w-5 h-5 object-contain"
            />

            <span className="hidden md:block">{item.name}</span>
          </NavLink>
        ))}

      </div>

   
      <div className="mt-auto p-4 hidden md:block">
        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-gray-600">
           Keep building courses!
        </div>
      </div>

    </div>
  );
};

export default Sidebar;