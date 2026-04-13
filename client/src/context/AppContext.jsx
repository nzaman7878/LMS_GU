import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [educatorData, setEducatorData] = useState(null);


  const calculateRating = (course) => {
    if (!course?.courseRatings || course.courseRatings.length === 0) return 0;
    const totalRating = course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return (totalRating / course.courseRatings.length).toFixed(1);
  };

  const calculateChapterTime = (chapter) => {
    let totalTime = 0;
    chapter?.chapterContent?.forEach((lecture) => (totalTime += lecture.lectureDuration));
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



  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
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
    try {
      const token = localStorage.getItem("studentToken");
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/students/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

const fetchStudentProfile = async (token) => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/students/profile`, { // Verify this URL!
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Full API Response:", data); // CHECK YOUR BROWSER CONSOLE

    if (data.success) {
      // If your backend returns { success: true, student: {...} }
      setStudent(data.student);
    } 
  } catch (error) {
    console.error("Profile Fetch Error:", error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};


  const loginStudent = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/students/login`, { email, password });
      if (data.success && data.token) {
        localStorage.setItem("studentToken", data.token);
        setStudent(data.student);
        fetchUserEnrolledCourses(); 
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };


const getToken = async () => {
 
  return localStorage.getItem("educatorToken") || localStorage.getItem("studentToken");
};

const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      return { success: false, message: "Session expired. Please login again." };
    }

    const { data } = await axios.put(
      `${backendUrl}/api/students/update-profile`,
      formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      await fetchStudentProfile(token); 
      return { success: true };
    }

    return { success: false, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

  const logoutStudent = () => {
    localStorage.removeItem("studentToken");
    setStudent(null);
    setEnrolledCourses([]);
    navigate("/");
  };

const loginEducator = async (email, password) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/educator/login`, { email, password });
    
    if (data.success) {
    
      localStorage.setItem("educatorToken", data.eToken); 
      localStorage.setItem("educatorData", JSON.stringify(data.educator));
      
      setIsEducator(true);
      setEducatorData(data.educator);
      
      return { success: true };
    }
    return { success: false, message: data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};


  useEffect(() => {
    fetchAllCourses();
    
    const studentToken = localStorage.getItem("studentToken");
    if (studentToken) {
      fetchStudentProfile(studentToken);
      fetchUserEnrolledCourses();
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
    student, setStudent,
    loginStudent,updateProfile, logoutStudent,
    loginEducator,
    allCourses, fetchAllCourses,
    enrolledCourses, fetchUserEnrolledCourses,
    currency, backendUrl, navigate, loading,
    calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
    isEducator, educatorData, setIsEducator, setEducatorData,getToken, 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);