import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddInterviewQuestion from './AddInterviewQuestion'; 
import InterviewSubmissions from './InterviewSubmissions';
import EditInterviewModal from './EditInterviewModal'; 

const InterviewManagement = () => {
  const { backendUrl, isEducator } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    questionsByCategory: []
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allQuestions, setAllQuestions] = useState([]);

 
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    if (isEducator && activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab, isEducator]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("educatorToken");
    if (!token) return;

    setLoadingStats(true);
    try {
      const [questionsRes, submissionsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/educator/interviews`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${backendUrl}/api/educator/interviews/submissions`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (questionsRes.data.success && submissionsRes.data.success) {
        const questions = questionsRes.data.questions;
        const submissions = submissionsRes.data.submissions;
        
        setAllQuestions(questions);

        const categoryCounts = questions.reduce((acc, q) => {
          acc[q.category] = (acc[q.category] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalQuestions: questions.length,
          totalSubmissions: submissions.length,
          pendingReviews: submissions.filter(sub => sub.status === 'Pending').length,
          questionsByCategory: Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
        });
      }
    } catch (error) {
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question? This will also delete all student submissions linked to it.")) return;

    const token = localStorage.getItem("educatorToken");
    try {
      const response = await axios.delete(`${backendUrl}/api/educator/interviews/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchDashboardData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete question.");
    }
  };

  if (!isEducator) {
    return <div className="flex items-center justify-center h-screen w-full text-gray-500">Access Denied</div>;
  }

  const filteredQuestions = allQuestions.filter(q => 
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-y-auto">
      
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-6 pb-0 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Interview Management</h1>
          
          <div className="flex gap-6 overflow-x-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`pb-4 px-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>
              Overview & Search
            </button>
            <button onClick={() => setActiveTab('add')} className={`pb-4 px-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'add' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>
              + Add New Question
            </button>
            <button onClick={() => setActiveTab('submissions')} className={`pb-4 px-2 font-semibold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'submissions' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>
              Grade Submissions
              {stats.pendingReviews > 0 && activeTab !== 'submissions' && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{stats.pendingReviews} New</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full flex-1 relative">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {loadingStats ? (
              <div className="text-gray-500">Loading statistics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-4xl font-black text-indigo-600">{stats.totalQuestions}</span>
                  <span className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-wide">Total Questions</span>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-4xl font-black text-blue-600">{stats.totalSubmissions}</span>
                  <span className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-wide">Student Attempts</span>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                  <span className={`text-4xl font-black ${stats.pendingReviews > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {stats.pendingReviews}
                  </span>
                  <span className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-wide">Pending Reviews</span>
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-800">Your Question Bank</h3>
                <div className="w-full md:w-96 relative">
                  <input 
                    type="text" 
                    placeholder="Search by keyword or category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {loadingStats ? null : filteredQuestions.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border text-center text-gray-500">
                  {searchQuery ? "No questions match your search." : "You haven't added any questions yet."}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredQuestions.map((q) => (
                    <div key={q._id} className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase">{q.category}</span>
                          <span className="text-xs text-gray-400 font-medium">Added {new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-800 font-medium text-sm">{q.questionText}</p>
                        
                        <details className="mt-3 text-xs text-gray-500 cursor-pointer">
                          <summary className="font-semibold hover:text-indigo-600 outline-none">Show Ideal Answer</summary>
                          <div className="mt-2 p-3 bg-gray-50 rounded border text-gray-700 cursor-text">{q.idealAnswer}</div>
                        </details>
                      </div>
                      
                      <div className="flex flex-row md:flex-col justify-start md:items-end gap-3 shrink-0 mt-3 md:mt-0">
                  
                         <button onClick={() => setEditingQuestion(q)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded">Edit</button>
                         <button onClick={() => handleDelete(q._id)} className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {activeTab === 'add' && (
          <div className="animate-in fade-in duration-300">
            <AddInterviewQuestion onSuccess={() => {
              fetchDashboardData(); 
              setActiveTab('dashboard');
            }} />
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="animate-in fade-in duration-300 -mx-4 md:-mx-8">
            <InterviewSubmissions />
          </div>
        )}

      </div>

      {editingQuestion && (
        <EditInterviewModal 
          question={editingQuestion} 
          onClose={() => setEditingQuestion(null)}
          onSuccess={() => {
            setEditingQuestion(null);
            fetchDashboardData();
          }}
        />
      )}

    </div>
  );
};

export default InterviewManagement;