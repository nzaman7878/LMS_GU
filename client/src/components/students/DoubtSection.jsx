import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const DoubtSection = ({ courseId, lectureId }) => {
  const { backendUrl, student, isEducator, educatorData } = useContext(AppContext);
  
  const [doubts, setDoubts] = useState([]);
  const [newDoubtText, setNewDoubtText] = useState("");
  const [replyTexts, setReplyTexts] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit States
  const [editingDoubtId, setEditingDoubtId] = useState(null);
  const [editDoubtText, setEditDoubtText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  const currentUserId = isEducator ? (educatorData?._id || educatorData?.id) : (student?._id || student?.id);

  useEffect(() => {
    if (courseId && lectureId) {
      fetchDoubts();
    }
  }, [courseId, lectureId]);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/students/doubts/${courseId}/${lectureId}`);
      if (data.success) {
        setDoubts(data.doubts);
      }
    } catch (error) {
      console.error("Error fetching doubts", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = isEducator ? localStorage.getItem("educatorToken") : localStorage.getItem("studentToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // --- ASK DOUBT ---
  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!newDoubtText.trim()) return;
    if (isEducator) return toast.info("Educators can reply to doubts, but only students ask them here.");

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/students/doubts/ask`,
        {
          courseId, lectureId, studentName: student.name, studentId: currentUserId, questionText: newDoubtText,
        },
        getAuthHeaders()
      );

      if (data.success) {
        setDoubts([data.doubt, ...doubts]); 
        setNewDoubtText("");
        toast.success("Question posted!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post question");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE DOUBT ---
  const handleDeleteDoubt = async (doubtId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      // Pass studentId in body just in case your backend expects it there
      const { data } = await axios.delete(`${backendUrl}/api/students/doubts/${doubtId}`, {
        ...getAuthHeaders(), data: { studentId: currentUserId }
      });
      if (data.success) {
        setDoubts(doubts.filter(d => d._id !== doubtId));
        toast.success("Question deleted");
      }
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  // --- EDIT DOUBT ---
  const handleEditDoubtSubmit = async (e, doubtId) => {
    e.preventDefault();
    if (!editDoubtText.trim()) return;
    try {
      const { data } = await axios.put(`${backendUrl}/api/students/doubts/${doubtId}`, 
        { questionText: editDoubtText, studentId: currentUserId }, 
        getAuthHeaders()
      );
      if (data.success) {
        setDoubts(doubts.map(d => d._id === doubtId ? data.doubt : d));
        setEditingDoubtId(null);
        toast.success("Question updated");
      }
    } catch (error) {
      toast.error("Failed to update question");
    }
  };

  // --- REPLY ---
  const handleReply = async (e, doubtId) => {
    e.preventDefault();
    const text = replyTexts[doubtId];
    if (!text || !text.trim()) return;

    const userType = isEducator ? "Educator" : "Student";
    const name = isEducator ? educatorData.name : student.name;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/students/doubts/${doubtId}/reply`,
        { userId: currentUserId, userType, name, text },
        getAuthHeaders()
      );
      if (data.success) {
        setDoubts(doubts.map(d => d._id === doubtId ? data.doubt : d));
        setReplyTexts({ ...replyTexts, [doubtId]: "" });
        toast.success("Reply posted!");
      }
    } catch (error) {
      toast.error("Failed to post reply");
    }
  };

  // --- DELETE REPLY ---
  const handleDeleteReply = async (doubtId, replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/students/doubts/${doubtId}/reply/${replyId}`, {
        ...getAuthHeaders(), data: { studentId: currentUserId }
      });
      if (data.success) {
        setDoubts(doubts.map(d => d._id === doubtId ? data.doubt : d));
        toast.success("Reply deleted");
      }
    } catch (error) {
      toast.error("Failed to delete reply");
    }
  };

  // --- EDIT REPLY ---
  const handleEditReplySubmit = async (e, doubtId) => {
    e.preventDefault();
    if (!editReplyText.trim()) return;
    try {
      const { data } = await axios.put(`${backendUrl}/api/students/doubts/${doubtId}/reply/${editingReplyId}`, 
        { text: editReplyText, studentId: currentUserId }, 
        getAuthHeaders()
      );
      if (data.success) {
        setDoubts(doubts.map(d => d._id === doubtId ? data.doubt : d));
        setEditingReplyId(null);
        toast.success("Reply updated");
      }
    } catch (error) {
      toast.error("Failed to update reply");
    }
  };

  return (
    <div className="mt-6 bg-white rounded shadow-lg border overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
        <h3 className="font-bold text-gray-800 text-lg">Q&A / Doubts</h3>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{doubts.length}</span>
      </div>

      <div className="p-4 bg-white">
        {!isEducator && (
          <form onSubmit={handleAskDoubt} className="mb-6 border-b pb-6">
            <textarea
              value={newDoubtText}
              onChange={(e) => setNewDoubtText(e.target.value)}
              placeholder="What are you struggling to understand in this video?"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={isSubmitting || !newDoubtText.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {isSubmitting ? "Posting..." : "Post Question"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-4 text-gray-500 text-sm">Loading doubts...</div>
        ) : doubts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm font-medium">No questions asked yet.</p>
            {!isEducator && <p className="text-xs mt-1">Be the first to ask a question!</p>}
          </div>
        ) : (
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {doubts.map((doubt) => {
              const isMyDoubt = doubt.studentId === currentUserId;

              return (
                <div key={doubt._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  
                  {/* MAIN DOUBT HEADER */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{doubt.studentName}</span>
                      <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Student</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-medium">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                      {isMyDoubt && editingDoubtId !== doubt._id && (
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingDoubtId(doubt._id); setEditDoubtText(doubt.questionText); }} className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDeleteDoubt(doubt._id)} className="text-[10px] font-bold text-red-600 hover:underline">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EDIT OR SHOW MAIN DOUBT */}
                  {editingDoubtId === doubt._id ? (
                    <form onSubmit={(e) => handleEditDoubtSubmit(e, doubt._id)} className="mb-4">
                      <textarea value={editDoubtText} onChange={(e) => setEditDoubtText(e.target.value)} className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500" rows="2" />
                      <div className="flex gap-2 mt-1">
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">Save</button>
                        <button type="button" onClick={() => setEditingDoubtId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-800 mb-4">{doubt.questionText}</p>
                  )}

                  {/* REPLIES */}
                  {doubt.replies && doubt.replies.length > 0 && (
                    <div className="ml-4 pl-4 border-l-2 border-gray-300 space-y-3 mb-4">
                      {doubt.replies.map((reply) => {
                        const isMyReply = reply.userId === currentUserId;
                        
                        return (
                          <div key={reply._id} className={`p-3 rounded-md border ${reply.userType === 'Educator' ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${reply.userType === 'Educator' ? 'text-indigo-900' : 'text-gray-800'}`}>{reply.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${reply.userType === 'Educator' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                  {reply.userType}
                                </span>
                              </div>
                              {isMyReply && editingReplyId !== reply._id && (
                                <div className="flex gap-2">
                                  <button onClick={() => { setEditingReplyId(reply._id); setEditReplyText(reply.text); }} className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
                                  <button onClick={() => handleDeleteReply(doubt._id, reply._id)} className="text-[10px] font-bold text-red-600 hover:underline">Delete</button>
                                </div>
                              )}
                            </div>

                            {/* EDIT OR SHOW REPLY */}
                            {editingReplyId === reply._id ? (
                              <form onSubmit={(e) => handleEditReplySubmit(e, doubt._id)} className="mt-2">
                                <input type="text" value={editReplyText} onChange={(e) => setEditReplyText(e.target.value)} className="w-full border rounded px-2 py-1 text-sm outline-none" />
                                <div className="flex gap-2 mt-1">
                                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">Save</button>
                                  <button type="button" onClick={() => setEditingReplyId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Cancel</button>
                                </div>
                              </form>
                            ) : (
                              <p className={`text-sm ${reply.userType === 'Educator' ? 'text-indigo-800' : 'text-gray-700'}`}>{reply.text}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* REPLY FORM */}
                  <form onSubmit={(e) => handleReply(e, doubt._id)} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replyTexts[doubt._id] || ""}
                      onChange={(e) => setReplyTexts({ ...replyTexts, [doubt._id]: e.target.value })}
                      placeholder={isEducator ? "Reply as Educator..." : "Help your classmate out..."}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" disabled={!replyTexts[doubt._id]?.trim()} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50 transition-colors">
                      Reply
                    </button>
                  </form>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtSection;