
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
     { name: 'Add Educator', path: '/admin/add-educators', icon: <Users size={20} /> },
    { name: 'Manage Courses', path: '/admin/manage-courses', icon: <BookOpen size={20} /> },
    { name: 'Manage Educators', path: '/admin/manage-educators', icon: <GraduationCap size={20} /> },
    { name: 'Manage Students', path: '/admin/manage-students', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-white min-h-screen shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-indigo-600">LMS Admin</h2>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'} 
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;