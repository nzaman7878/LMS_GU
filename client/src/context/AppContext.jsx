import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { toast } from "react-toastify";


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const [allcourses, setAllCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [educatorData, setEducatorData] = useState(null);

 

  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    const totalRating = course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return (totalRating / course.courseRatings.length).toFixed(1);
  };

  const calculateChapterTime = (chapter) => {
    let totalTime = 0;
    chapter.chapterContent.forEach((lecture) => (totalTime += lecture.lectureDuration));
    return humanizeDuration(totalTime * 60 * 1000, { units: ["h", "m"], round: true });
  };

  const calculateCourseDuration = (course) => {
    let totalTime = 0;
    course?.courseContent?.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        totalTime += lecture?.lectureDuration || 0;
      });
    });
    return humanizeDuration(totalTime * 60 * 1000, { units: ["h", "m"], round: true });
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course?.courseContent?.forEach((chapter) => {
      totalLectures += chapter?.chapterContent?.length || 0;
    });
    return totalLectures;
  };



  // Fetch All Courses
const fetchAllCourses = async () => {
  try {
    const { data } = await axios.get(backendUrl + "/api/course/all");

    if (data.success) {
      setAllCourses(data.courses);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  const fetchStudentProfile = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/students/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setStudent(data.student);
      }
    } catch (error) {
      localStorage.removeItem("studentToken");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/students/register`, { name, email, password });
      return data.success ? { success: true, message: data.message } : { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  const loginStudent = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/students/login`, { email, password });
      if (data.success && data.token) {
        localStorage.setItem("studentToken", data.token);
        setStudent(data.student);
        navigate("/");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logoutStudent = () => {
    localStorage.removeItem("studentToken");
    setStudent(null);
    navigate("/");
  };

  const loginEducator = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/educator/login`, { email, password });
      if (data.success && data.eToken) {
        localStorage.setItem("educatorToken", data.eToken);
        localStorage.setItem("educatorData", JSON.stringify(data.educator));
        setIsEducator(true);
        setEducatorData(data.educator);
        navigate("/educator/dashboard");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logoutEducator = () => {
    localStorage.removeItem("educatorToken");
    localStorage.removeItem("educatorData");
    setIsEducator(false);
    setEducatorData(null);
    navigate("/");
  };



  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();

   
    const studentToken = localStorage.getItem("studentToken");
    if (studentToken) {
      fetchStudentProfile(studentToken);
    } else {
      setLoading(false);
    }

 
    const eToken = localStorage.getItem("educatorToken");
    const eData = localStorage.getItem("educatorData");
    if (eToken && eData) {
      setIsEducator(true);
      setEducatorData(JSON.parse(eData));
    }
  }, []);

  const value = {
    student, loginStudent, logoutStudent, registerStudent,
    isEducator, educatorData, loginEducator, logoutEducator,
    loading, currency, allcourses, navigate, enrolledCourses,
    setEnrolledCourses, fetchUserEnrolledCourses,
    calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);