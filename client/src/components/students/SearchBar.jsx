import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate("/course-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full h-12 md:h-14 flex items-center bg-white 
                 border border-gray-300 rounded-lg shadow-sm 
                 focus-within:ring-2 focus-within:ring-blue-500 
                 transition-all duration-200"
    >
      <img
        src={assets.search_icon}
        className="w-5 md:w-6 ml-4 mr-2 opacity-70"
        alt="Search Icon"
      />

      <input
        type="text"
        placeholder="Search courses..."
        className="flex-1 h-full outline-none text-gray-700 placeholder-gray-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        type="submit"
        className="h-10 md:h-12 px-6 md:px-8 mr-2 bg-blue-600 
                   text-white rounded-md hover:bg-blue-700 
                   transition duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
