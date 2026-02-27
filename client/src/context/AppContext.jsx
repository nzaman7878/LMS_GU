import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const backendUrl = "http://localhost:3000/api";

  const navigate = useNavigate();
  const [allcourses, setAllCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;

    let totalRating = 0;

    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });

    return totalRating / course.courseRatings.length;
  };
  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");

    if (token) {
      fetchStudentProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStudentProfile = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/students/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudent(data.student);
    } catch (error) {
      localStorage.removeItem("studentToken");
      setStudent(null);
    }
    setLoading(false);
  };

  const registerStudent = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/students/register`, {
        name,
        email,
        password,
      });

      if (data.success) {
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const loginStudent = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/students/login`, {
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("studentToken", data.token);
        await fetchStudentProfile(data.token);
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logoutStudent = () => {
    localStorage.removeItem("studentToken");
    setStudent(null);
  };

  const value = {
    student,
    registerStudent,
    loading,
    loginStudent,
    logoutStudent,
    currency,
    allcourses,
    navigate,
    calculateRating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
