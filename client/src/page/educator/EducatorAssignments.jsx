import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const EducatorAssignments = () => {
  const { backendUrl } = useContext(AppContext);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const [gradingSubmissionId, setGradingSubmissionId] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("educatorToken");
      const { data } = await axios.get(`${backendUrl}/api/educator/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setAssignments(data.assignments);
    } catch (error) {
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const token = localStorage.getItem("educatorToken");
      const { data } = await axios.get(`${backendUrl}/api/educator/assignment/${assignmentId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setSubmissions(data.submissions);
    } catch (error) {
      toast.error("Failed to load submissions");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment._id);
    setGradingSubmissionId(null); 
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("educatorToken");
      const { data } = await axios.put(`${backendUrl}/api/educator/assignment/grade`, {
        submissionId: gradingSubmissionId,
        marksAwarded: Number(marks),
        educatorFeedback: feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Grade submitted!");
        setGradingSubmissionId(null);
        setMarks("");
        setFeedback("");
        fetchSubmissions(selectedAssignment._id); 
        fetchAssignments(); 
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  };

  if (isLoading) return <div className="p-8">Loading assignments...</div>;

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-gray-50 w-full">
      
     
      <div className="w-full md:w-1/3 border-r bg-white flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">My Assignments</h2>
          <p className="text-sm text-gray-500">Select an assignment to grade submissions.</p>
        </div>
        
        <div className="p-4 space-y-3">
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">No assignments created yet.</p>
          ) : (
            assignments.map((assignment) => (
              <div 
                key={assignment._id} 
                onClick={() => handleSelectAssignment(assignment)}
                className={`p-4 rounded-lg cursor-pointer transition border ${selectedAssignment?._id === assignment._id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 truncate pr-2">{assignment.title}</h3>
                  {assignment.pendingGrading > 0 && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                      {assignment.pendingGrading} New
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{assignment.courseId?.courseTitle}</p>
                <p className="text-xs font-medium text-gray-400 mt-2">{assignment.totalSubmissions} Total Submissions</p>
              </div>
            ))
          )}
        </div>
      </div>

    
      <div className="w-full md:w-2/3 h-full overflow-y-auto bg-gray-50 p-6 md:p-8">
        {!selectedAssignment ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select an assignment from the left to view submissions.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            
         
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedAssignment.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Course: {selectedAssignment.courseId?.courseTitle} | Total Marks: {selectedAssignment.totalMarks}</p>
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                {selectedAssignment.description}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Student Submissions ({submissions.length})</h3>
            
            {submissions.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-xl border text-center">No students have submitted this assignment yet.</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img src={sub.studentId?.image || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-gray-800">{sub.studentId?.name}</p>
                          <p className="text-xs text-gray-500">{sub.studentId?.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${sub.status === "Graded" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {sub.status === "Graded" ? `Graded: ${sub.marksAwarded}/${selectedAssignment.totalMarks}` : "Needs Grading"}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {sub.answerText || <span className="italic text-gray-400">No text answer provided.</span>}
                    </div>

                    {sub.fileUrl && (
                      <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="inline-block mb-4 text-sm font-semibold text-blue-600 hover:underline">
                        📎 View Attached File
                      </a>
                    )}

                   
                    {gradingSubmissionId === sub._id ? (
                      <form onSubmit={handleGradeSubmit} className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mt-2">
                        <h4 className="font-bold text-sm text-blue-900 mb-3">Grade this submission</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Marks (out of {selectedAssignment.totalMarks})</label>
                            <input type="number" max={selectedAssignment.totalMarks} required value={marks} onChange={(e) => setMarks(e.target.value)} className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500" />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Feedback (Optional)</label>
                            <input type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Great job..." className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">Submit Grade</button>
                          <button type="button" onClick={() => setGradingSubmissionId(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      sub.status === "Pending" && (
                        <button onClick={() => { setGradingSubmissionId(sub._id); setMarks(""); setFeedback(""); }} className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 rounded text-sm font-bold hover:bg-indigo-600 hover:text-white transition">
                          Grade Student
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorAssignments;