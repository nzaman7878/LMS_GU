import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://localhost:3000/api"; 

  
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      setStudent({ token });
    }
    setLoading(false);
  }, []);

 const loginStudent = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/students/login`,
      { email, password }
    );

    if (data.token) {  
      localStorage.setItem("studentToken", data.token);
      setStudent(data.student);
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
    loading,
    loginStudent,
    logoutStudent,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => useContext(AppContext);