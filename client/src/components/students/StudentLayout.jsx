import React from "react";

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default StudentLayout;