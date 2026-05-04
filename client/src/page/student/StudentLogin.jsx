import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; 
import { toast } from "react-toastify"; 
const StudentLogin = () => {

  const { loginStudent, registerStudent, loginEducator, googleLoginStudent } = useAppContext();
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

    if (role === "educator") {
      const res = await loginEducator(form.email, form.password);
      if (res.success) {
        navigate("/educator/dashboard");
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

  const handleGoogleSuccess = async (credentialResponse) => {
    
    if (!googleLoginStudent) {
        console.error("googleLoginStudent function is missing from AppContext");
        return;
    }

    try {
      const res = await googleLoginStudent(credentialResponse.credential);
      if (res.success) {
        toast.success("Google Login successful!");
        navigate("/student/dashboard");
      } else {
        toast.error(res.message || "Google Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during Google Login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-[400px]" // slightly widened to fit Google button better
      >
        
        <div className="flex mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            } rounded-l-lg font-medium transition-colors`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("educator")}
            className={`flex-1 py-2 ${
              role === "educator"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            } rounded-r-lg font-medium transition-colors`}
          >
            Educator
          </button>
        </div>

       
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {role === "educator"
            ? "Educator Login"
            : isLogin
            ? "Student Login"
            : "Create Account"}
        </h2>

        {/* Inputs */}
        {role === "student" && !isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-medium transition text-white ${
            role === "educator"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {role === "educator"
            ? "Login"
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>

        {role === "student" && (
          <>
           
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

        
            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login failed")}
                useOneTap
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          </>
        )}


        {role === "student" && (
          <p className="text-sm text-center text-gray-600">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 cursor-pointer ml-2 font-semibold hover:underline"
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