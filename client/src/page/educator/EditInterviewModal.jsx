import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditInterviewModal = ({ question, onClose, onSuccess }) => {
  const { backendUrl } = useContext(AppContext);
  const [isUpdating, setIsUpdating] = useState(false);
  
 
  const [editFormData, setEditFormData] = useState({
    questionText: '',
    idealAnswer: '',
    hint: '',
    category: ''
  });

  useEffect(() => {
    if (question) {
      setEditFormData({
        questionText: question.questionText || '',
        idealAnswer: question.idealAnswer || '',
        hint: question.hint || '',
        category: question.category || 'Web Dev'
      });
    }
  }, [question]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("educatorToken");
    setIsUpdating(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/educator/interviews/${question._id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Question updated successfully!");
        onSuccess(); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update question.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Edit Question</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleUpdateSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              required
              value={editFormData.category}
              onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Web Dev">Web Development</option>
              <option value="AI/ML">AI & Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="App Dev">App Development</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <textarea 
              required rows="3"
              value={editFormData.questionText}
              onChange={(e) => setEditFormData({...editFormData, questionText: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ideal Answer</label>
            <textarea 
              required rows="4"
              value={editFormData.idealAnswer}
              onChange={(e) => setEditFormData({...editFormData, idealAnswer: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hint (Optional)</label>
            <input 
              type="text"
              value={editFormData.hint}
              onChange={(e) => setEditFormData({...editFormData, hint: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="submit" 
              disabled={isUpdating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-md transition-colors disabled:bg-indigo-400"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditInterviewModal;