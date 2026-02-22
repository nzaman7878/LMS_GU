import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const StudentDashboard = () => {

  const { logoutStudent } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutStudent();
    navigate("/");  
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Welcome Student 🎓
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;