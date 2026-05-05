
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; 

const EnrollmentLoading = () => {
  const navigate = useNavigate();
  const { fetchUserEnrolledCourses } = useContext(AppContext);

  useEffect(() => {
    const init = async () => {
      await fetchUserEnrolledCourses(); 
      navigate("/my-enrollments");      
    };
    init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-16 sm:w-20 aspect-square border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm font-medium">Processing your enrollment...</p>
    </div>
  );
};

export default EnrollmentLoading;