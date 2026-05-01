import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentInterviews = () => {
  const { backendUrl, student } = useContext(AppContext);
  
  // Data States
  const [questions, setQuestions] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [activeTab, setActiveTab] = useState('practice'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Web Dev', 'AI/ML', 'Data Science', 'App Dev', 'Soft Skills'];

  // Modal States
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch attempts once when the student loads so we know what they've already answered
  useEffect(() => {
    if (student) {
      fetchMyAttempts();
    }
  }, [student]);

  // 2. Fetch questions whenever the category changes
  useEffect(() => {
    if (student) {
      fetchQuestions();
    }
  }, [selectedCategory, student]);

  const fetchQuestions = async () => {
    const token = localStorage.getItem("studentToken"); 
    if (!token) return setLoading(false);

    setLoading(true);
    try {
      const query = selectedCategory === 'All' ? '' : `?category=${selectedCategory}`;
      const response = await axios.get(`${backendUrl}/api/students/interviews${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setQuestions(response.data.questions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to load interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAttempts = async () => {
    const token = localStorage.getItem("studentToken"); 
    try {
      const response = await axios.get(`${backendUrl}/api/students/interviews/my-attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMyAttempts(response.data.attempts);
      }
    } catch (error) {
      console.error("Failed to load attempts", error);
    }
  };

  const handleSubmitAttempt = async () => {
    if (!answerText.trim()) return toast.warning("Please write an answer before submitting.");

    const token = localStorage.getItem("studentToken");
    setIsSubmitting(true);
    const submitToast = toast.loading("Submitting your answer...");

    try {
      const response = await axios.post(
        `${backendUrl}/api/students/interviews/attempt`,
        {
          studentId: student._id || student.id,
          questionId: activeQuestion._id,
          category: activeQuestion.category,
          submittedAnswer: answerText
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss(submitToast);

      if (response.data.success) {
        toast.success("Answer submitted! You can now view the ideal answer in the Submissions tab.");
        closeModal();
        await fetchMyAttempts(); // Re-fetch attempts so the button updates to "Attempted"
        setActiveTab('submissions'); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(submitToast);
      toast.error(error.response?.data?.message || "Failed to submit answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setActiveQuestion(null);
    setAnswerText('');
    setShowHint(false);
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!student) {
    return <div className="flex justify-center items-center h-[70vh] text-gray-500">Please log in to access interview questions.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR FOR CATEGORIES */}
      <div className="w-64 bg-white border-r shadow-sm hidden md:block p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === cat 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Prep</h1>
              <p className="text-gray-600 mt-1">Master your skills with educator feedback.</p>
            </div>

            {/* SEARCH BAR */}
            {activeTab === 'practice' && (
              <div className="w-full md:w-72 relative">
                <input 
                  type="text" 
                  placeholder="Search questions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* TABS */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('practice')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${activeTab === 'practice' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Practice Questions
            </button>
            <button 
              onClick={() => setActiveTab('submissions')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${activeTab === 'submissions' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Submissions & Feedback
            </button>
          </div>

          {/* CONTENT: PRACTICE TAB */}
          {activeTab === 'practice' && (
            loading ? <div className="text-gray-500 mt-10">Loading questions...</div> :
            filteredQuestions.length === 0 ? (
              <div className="bg-white p-10 rounded-xl border text-center text-gray-500">No questions found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredQuestions.map((q, index) => {
                  // CHECK IF ATTEMPTED
                  const isAttempted = myAttempts.some(attempt => attempt.questionId?._id === q._id);

                  return (
                    <div key={q._id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between ${isAttempted ? 'opacity-70' : ''}`}>
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-md text-sm">
                            Question {index + 1}
                          </span>
                          <span className="text-xs font-bold text-gray-500 uppercase">{q.category}</span>
                        </div>
                        <p className="text-gray-800 font-medium mb-4">{q.questionText}</p>
                      </div>
                      
                      <button 
                        onClick={() => !isAttempted && setActiveQuestion(q)}
                        disabled={isAttempted}
                        className={`w-full font-semibold py-2 rounded-lg transition-colors ${
                          isAttempted 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                            : 'bg-gray-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        {isAttempted ? 'Already Attempted' : 'Attempt Answer'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* CONTENT: MY SUBMISSIONS TAB */}
          {activeTab === 'submissions' && (
            myAttempts.length === 0 ? (
              <div className="bg-white p-10 rounded-xl border text-center text-gray-500">You haven't submitted any answers yet.</div>
            ) : (
              <div className="flex flex-col gap-6">
                {myAttempts.map((attempt, index) => {
                  const isReviewed = attempt.status === 'Reviewed';
                  // Define "wrong" as a score less than 5 out of 10
                  const isWrong = isReviewed && attempt.score < 5;

                  return (
                    <div key={attempt._id} className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <span className="font-bold text-gray-800">Attempt {index + 1} • <span className="text-gray-500 font-normal">{attempt.category}</span></span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isReviewed ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {attempt.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-700">Question:</h4>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded border text-sm mt-1">{attempt.questionId?.questionText}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-700">Your Answer:</h4>
                        <p className={`p-3 rounded border text-sm mt-1 whitespace-pre-wrap ${
                          isWrong ? 'bg-red-50 border-red-100 text-red-900' : 'bg-blue-50 border-blue-100 text-gray-800'
                        }`}>
                          {attempt.submittedAnswer}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-700">Ideal Educator Answer:</h4>
                        <p className="text-gray-800 bg-gray-100 p-3 rounded border border-gray-200 text-sm mt-1 whitespace-pre-wrap">{attempt.questionId?.idealAnswer}</p>
                      </div>

                      {/* CONDITIONAL RED/GREEN EDUCATOR FEEDBACK */}
                      {isReviewed && (
                        <div className={`mt-6 border p-4 rounded-lg ${isWrong ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className={`font-bold ${isWrong ? 'text-red-900' : 'text-green-900'}`}>Educator Feedback</h4>
                            <span className={`${isWrong ? 'bg-red-600' : 'bg-green-600'} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                              Score: {attempt.score}/10
                            </span>
                          </div>
                          <p className={`text-sm ${isWrong ? 'text-red-800' : 'text-green-800'}`}>
                            {attempt.educatorFeedback}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )
          )}

        </div>
      </div>

      {/* ATTEMPT MODAL */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase">{activeQuestion.category}</span>
                <h2 className="text-xl font-bold text-gray-900 mt-3">Submit your answer</h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border text-gray-800 font-medium mb-6">{activeQuestion.questionText}</div>

            {activeQuestion.hint && (
              <div className="mb-6">
                {!showHint ? (
                  <button onClick={() => setShowHint(true)} className="text-sm font-semibold text-amber-600 underline">Need a hint?</button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800"><span className="font-bold">Hint:</span> {activeQuestion.hint}</div>
                )}
              </div>
            )}

            <textarea 
              rows="6"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your detailed answer here..."
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
            />

            <div className="flex gap-3">
              <button onClick={handleSubmitAttempt} disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
              <button onClick={closeModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInterviews;