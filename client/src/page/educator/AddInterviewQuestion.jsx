import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const AddInterviewQuestion = () => {
  const { backendUrl, isEducator } = useContext(AppContext);

  const [questionText, setQuestionText] = useState('');
  const [idealAnswer, setIdealAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    const token = localStorage.getItem("educatorToken");
    if (!token) {
      return toast.error("User not authenticated. Please login again.");
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Saving question...");

    try {
      const response = await axios.post(
        `${backendUrl}/api/educator/interviews/create`,
        { questionText, idealAnswer, hint, category },
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success("Question added successfully!");
        
        setQuestionText('');
        setIdealAnswer('');
        setHint('');
        setCategory('');
      } else {
        toast.error(response.data.message || "Failed to add question");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding question.");
    } finally {
      setIsLoading(false);
    }
  };


  if (!isEducator) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-gray-500">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto flex flex-col items-start md:p-8 p-4 bg-gray-50 w-full">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-6 max-w-3xl w-full bg-white p-6 rounded-lg shadow-sm border text-gray-700"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Add Interview Question</h2>
        
       
        <div className="flex flex-col gap-2">
          <label className="font-medium">Category</label>
          <select 
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="" disabled>Select a Subject Area</option>
            <option value="Web Dev">Web Development</option>
            <option value="AI/ML">AI & Machine Learning</option>
            <option value="Data Science">Data Science</option>
            <option value="App Dev">App Development</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
        </div>

     
        <div className="flex flex-col gap-2">
          <label className="font-medium">Question Text</label>
          <textarea 
            required
            rows="3"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g., Explain the virtual DOM in React..."
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

   
        <div className="flex flex-col gap-2">
          <label className="font-medium">Ideal Answer (For grading reference)</label>
          <textarea 
            required
            rows="4"
            value={idealAnswer}
            onChange={(e) => setIdealAnswer(e.target.value)}
            placeholder="Outline what a perfect student answer looks like..."
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Hint (Optional)</label>
          <input 
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Provide a small clue for the student..."
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-all mt-4 disabled:bg-blue-400"
        >
          {isLoading ? 'SAVING...' : 'ADD QUESTION'}
        </button>

      </form>
    </div>
  );
};

export default AddInterviewQuestion;