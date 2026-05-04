import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AssignmentSection = ({ lectureId }) => {
  const { backendUrl } = useContext(AppContext);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const [answerTexts, setAnswerTexts] = useState({});
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("studentToken");
      const { data } = await axios.get(
        `${backendUrl}/api/students/assignment/lecture/${lectureId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setAssignments(data.assignments);
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lectureId) {
      fetchAssignments();
    }
  }, [lectureId]);

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("studentToken");
      const formData = new FormData();
      
      formData.append("assignmentId", assignmentId);
      
      if (answerTexts[assignmentId]) {
        formData.append("answerText", answerTexts[assignmentId]);
      }
      
      if (files[assignmentId]) {
        formData.append("file", files[assignmentId]);
      }

      if (!answerTexts[assignmentId] && !files[assignmentId]) {
        toast.error("Please provide an answer or attach a file.");
        setIsSubmitting(false);
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/students/assignment/submit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchAssignments(); 
       
        setAnswerTexts(prev => ({ ...prev, [assignmentId]: "" }));
        setFiles(prev => ({ ...prev, [assignmentId]: null }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-4 text-gray-500">Loading assignments...</div>;

  if (assignments.length === 0) {
    return <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">No assignments for this lecture.</div>;
  }

  return (
    <div className="space-y-6">
      {assignments.map((assignment) => {
        
        const submission = submissions.find((sub) => sub.assignmentId === assignment._id);

        return (
          <div key={assignment._id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
           
            <div className="bg-indigo-50 border-b border-indigo-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-indigo-900">📝 {assignment.title}</h3>
                  <p className="text-sm text-indigo-700 mt-1">Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No due date"}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded text-sm">
                  {assignment.totalMarks} Marks
                </div>
              </div>
            </div>

      
            <div className="p-4 text-gray-700 whitespace-pre-wrap">
              {assignment.description}
            </div>

          
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {submission ? (
            
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <h4 className="font-bold text-green-800">Assignment Submitted</h4>
                  </div>
                  
                  {submission.status === "Graded" ? (
                    <div className="mt-3 bg-white p-3 rounded border border-green-100">
                      <p className="font-bold text-gray-800">Grade: <span className="text-indigo-600">{submission.marksAwarded} / {assignment.totalMarks}</span></p>
                      {submission.educatorFeedback && (
                        <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Educator Feedback:</span> {submission.educatorFeedback}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-green-700 mt-1">Your submission is pending review by the educator.</p>
                  )}
                </div>
              ) : (
             
                <form onSubmit={(e) => handleSubmit(e, assignment._id)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Answer (Text)</label>
                    <textarea
                      rows="4"
                      placeholder="Type your answer here..."
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={answerTexts[assignment._id] || ""}
                      onChange={(e) => setAnswerTexts(prev => ({ ...prev, [assignment._id]: e.target.value }))}
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Attach File (Optional)</label>
                      <input
                        type="file"
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setFiles(prev => ({ ...prev, [assignment._id]: e.target.files[0] }))}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Assignment"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentSection;