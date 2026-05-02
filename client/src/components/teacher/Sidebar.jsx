import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets.js';

const Sidebar = () => {

  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator/dashboard', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Students Enrolled', path: '/educator/students-enrolled', icon: assets.person_tick_icon },
  
    { name: 'Interview Mgmt.', path: '/educator/interviews', icon: assets.person_tick_icon } ,
    
{ name: 'Course Q&A', path: '/educator/qna', icon: assets.person_tick_icon }
  ];


  if (!isEducator) return null;

  return (
    <div className="md:w-64 w-16 bg-white border-r shadow-sm min-h-screen flex flex-col">

      <div className="hidden md:flex items-center justify-center h-16 border-b">
        <h1 className="text-lg font-bold text-indigo-600">Educator Panel</h1>
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
            <span className="hidden md:block whitespace-nowrap">{item.name}</span>
          </NavLink>
        ))}

      </div>

      <div className="mt-auto p-4 hidden md:block">
        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-gray-600">
          Keep building amazing courses 
        </div>
      </div>

    </div>
  );
};

export default Sidebar;