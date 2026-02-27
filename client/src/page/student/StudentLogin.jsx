import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {

  const { loginStudent, registerStudent, loginTeacher } = useAppContext();
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); 
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (role === "teacher") {

      const res = await loginTeacher(form.email, form.password);

      if (res.success) {
        navigate("/teacher/dashboard");
      } else {
        alert(res.message);
      }

      return;
    }

    
    if (isLogin) {

      const res = await loginStudent(form.email, form.password);

      if (res.success) {
        navigate("/student/dashboard");
      } else {
        alert(res.message);
      }

    } else {

      const res = await registerStudent(
        form.name,
        form.email,
        form.password
      );

      if (res.success) {
        const loginRes = await loginStudent(
          form.email,
          form.password
        );

        if (loginRes.success) {
          navigate("/student/dashboard");
        }
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        
        <div className="flex mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 ${role === "student" ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-l-lg`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex-1 py-2 ${role === "teacher" ? "bg-green-600 text-white" : "bg-gray-200"} rounded-r-lg`}
          >
            Teacher
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {role === "teacher"
            ? "Teacher Login"
            : isLogin
              ? "Student Login"
              : "Create Student Account"}
        </h2>

        
        {role === "student" && !isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          className={`w-full py-3 rounded-lg transition text-white ${
            role === "teacher"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {role === "teacher"
            ? "Login"
            : isLogin
              ? "Login"
              : "Sign Up"}
        </button>

       
        {role === "student" && (
          <p className="text-sm text-center mt-4">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 cursor-pointer ml-2 font-medium"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        )}

      </form>
    </div>
  );
};

export default StudentLogin;