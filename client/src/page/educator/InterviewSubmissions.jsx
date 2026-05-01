import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const InterviewSubmissions = () => {
  const { backendUrl, isEducator } = useContext(AppContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to handle the inline review form
  const [reviewingId, setReviewingId] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem("educatorToken");
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/educator/interviews/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSubmissions(response.data.submissions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (attemptId) => {
    const token = localStorage.getItem("educatorToken");
    if (!score || !feedback) {
      return toast.warning("Please provide both a score and feedback.");
    }

    const reviewToast = toast.loading("Submitting review...");

    try {
      const response = await axios.put(
        `${backendUrl}/api/educator/interviews/submissions/${attemptId}/review`,
        { score: Number(score), educatorFeedback: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss(reviewToast);

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        
        // Update the local state so the UI reflects the change without reloading
        setSubmissions(prev => 
          prev.map(sub => 
            sub._id === attemptId 
              ? { ...sub, status: 'Reviewed', score: Number(score), educatorFeedback: feedback } 
              : sub
          )
        );
        
        // Close the inline form and clear state
        setReviewingId(null);
        setScore('');
        setFeedback('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(reviewToast);
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  if (!isEducator) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-gray-500">
        You do not have permission to view this page.
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading submissions...</div>;
  }

  return (
    <div className="p-4 md:p-8 w-full bg-gray-50 min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Submissions</h2>

      {submissions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-gray-500 shadow-sm">
          No interview submissions found yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-4xl">
          {submissions.map((sub) => (
            <div key={sub._id} className="bg-white rounded-lg shadow-sm border p-6 flex flex-col gap-4">
              
              {/* Header: Student Info & Status */}
              <div className="flex justify-between items-start border-b pb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={sub.studentId?.image || "https://via.placeholder.com/40"} 
                    alt="Student" 
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{sub.studentId?.name || "Unknown Student"}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {sub.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    sub.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              </div>

              {/* Q & A Section */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Question:</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded border text-sm">{sub.questionId?.questionText}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-1">Student's Answer:</p>
                <p className="text-gray-800 bg-blue-50 p-3 rounded border border-blue-100 text-sm whitespace-pre-wrap">
                  {sub.submittedAnswer}
                </p>
              </div>

              {/* Educator's Ideal Answer (For reference) */}
              <details className="text-sm text-gray-500 cursor-pointer mb-2">
                <summary className="font-medium hover:text-indigo-600 transition-colors">Show Ideal Answer (Reference)</summary>
                <div className="mt-2 p-3 bg-gray-100 border rounded text-gray-700 cursor-text">
                  {sub.questionId?.idealAnswer}
                </div>
              </details>

              {/* Review Section */}
              {sub.status === 'Reviewed' ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-2">
                  <p className="text-sm font-bold text-green-800 mb-1">Your Feedback (Score: {sub.score}/10)</p>
                  <p className="text-sm text-green-900">{sub.educatorFeedback}</p>
                </div>
              ) : (
                <div className="mt-2 border-t pt-4">
                  {reviewingId === sub._id ? (
                    <div className="flex flex-col gap-3 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="text-sm font-bold text-indigo-900">Grade Submission</h4>
                      
                      <div>
                        <label className="block text-xs font-medium text-indigo-800 mb-1">Score (0-10)</label>
                        <input 
                          type="number" 
                          min="0" max="10"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          className="w-full md:w-1/3 border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-indigo-800 mb-1">Constructive Feedback</label>
                        <textarea 
                          rows="3"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Tell the student what they did well and what they can improve..."
                          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleReviewSubmit(sub._id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700"
                        >
                          Submit Grade
                        </button>
                        <button 
                          onClick={() => {
                            setReviewingId(null);
                            setScore('');
                            setFeedback('');
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReviewingId(sub._id)}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Review & Grade
                    </button>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewSubmissions;