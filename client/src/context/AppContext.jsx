import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const backendUrl = "http://localhost:3000/api";
  const navigate = useNavigate();

  
  const [allcourses, setAllCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);


  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherData, setTeacherData] = useState(null);


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

  const calculateChapterTime = (chapter) => {
    let totalTime = 0;
    chapter.chapterContent.forEach(
      (lecture) => (totalTime += lecture.lectureDuration)
    );

    return humanizeDuration(totalTime * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  const calculateCourseDuration = (course) => {
    let totalTime = 0;

    course?.courseContent?.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        totalTime += lecture?.lectureDuration || 0;
      });
    });

    return humanizeDuration(totalTime * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;

    course?.courseContent?.forEach((chapter) => {
      totalLectures += chapter?.chapterContent?.length || 0;
    });

    return totalLectures;
  };

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };


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
      const { data } = await axios.get(
        `${backendUrl}/students/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudent(data.student);
    } catch (error) {
      localStorage.removeItem("studentToken");
      setStudent(null);
    }
    setLoading(false);
  };

const registerStudent = async (name, email, password) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/students/register`, 
      { name, email, password }
    );

   
    if (data.success) {
      return { success: true, message: data.message };
    }

    
    return { success: false, message: data.message };

  } catch (error) {
   
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed. Please try again.",
    };
  }
};

  const loginStudent = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/students/login`,
        { email, password }
      );

      if (data.success && data.token) {
        localStorage.setItem("studentToken", data.token);
        setStudent(data.student);

        navigate("/");
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

  useEffect(() => {
    const token = localStorage.getItem("teacherToken");
    const teacher = localStorage.getItem("teacherData");

    if (token && teacher) {
      setIsTeacher(true);
      setTeacherData(JSON.parse(teacher));
    }
  }, []);

  const loginTeacher = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/teacher/login`,
        { email, password }
      );

      if (data.success && data.tToken) {
        localStorage.setItem("teacherToken", data.tToken);
        localStorage.setItem("teacherData", JSON.stringify(data.teacher));

   
        setIsTeacher(true);
        setTeacherData(data.teacher);

        navigate("/teacher/dashboard");

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

  const logoutTeacher = () => {
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("teacherData");

    setIsTeacher(false);
    setTeacherData(null);

    navigate("/login");
  };


  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);


  const value = {

    student,
    loginStudent,
    logoutStudent,

   
    isTeacher,
    teacherData,
    loginTeacher,
    logoutTeacher,
    registerStudent,
    loading,
    currency,
    allcourses,
    navigate,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    setEnrolledCourses,
    fetchUserEnrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);