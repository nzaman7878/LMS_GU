import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EducatorDoubts = () => {
  const { backendUrl, isEducator, educatorData } = useContext(AppContext);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [replyTexts, setReplyTexts] = useState({});
  
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  useEffect(() => {
    if (isEducator) {
      fetchDoubts();
    }
  }, [isEducator]);

  const fetchDoubts = async () => {
    const token = localStorage.getItem("educatorToken");
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/educator/doubts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDoubts(response.data.doubts);
      }
    } catch (error) {
      toast.error("Failed to load Q&A dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e, doubtId) => {
    e.preventDefault();
    const text = replyTexts[doubtId];
    if (!text || !text.trim()) return;

    const token = localStorage.getItem("educatorToken");
    try {
      const response = await axios.post(
        `${backendUrl}/api/educator/doubts/${doubtId}/reply`,
        { text, name: educatorData?.name || "Educator" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Reply posted!");
        setDoubts(doubts.map(d => d._id === doubtId ? response.data.doubt : d));
        setReplyTexts({ ...replyTexts, [doubtId]: "" }); 
      }
    } catch (error) {
      toast.error("Failed to post reply.");
    }
  };


  const handleDeleteDoubt = async (doubtId) => {
    if (!window.confirm("Delete this entire question and all replies?")) return;
    
    const token = localStorage.getItem("educatorToken");
    try {
      const response = await axios.delete(`${backendUrl}/api/educator/doubts/${doubtId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success("Question deleted.");
        setDoubts(doubts.filter(d => d._id !== doubtId));
      }
    } catch (error) {
      toast.error("Failed to delete question.");
    }
  };

  const handleDeleteReply = async (doubtId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;

    const token = localStorage.getItem("educatorToken");
    try {
      const response = await axios.delete(`${backendUrl}/api/educator/doubts/${doubtId}/reply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success("Reply deleted.");
        setDoubts(doubts.map(d => d._id === doubtId ? response.data.doubt : d));
      }
    } catch (error) {
      toast.error("Failed to delete reply.");
    }
  };

  // --- EDIT A SPECIFIC REPLY ---
  const startEditingReply = (replyId, currentText) => {
    setEditingReplyId(replyId);
    setEditReplyText(currentText);
  };

  const handleEditReplySubmit = async (e, doubtId) => {
    e.preventDefault();
    if (!editReplyText.trim()) return;

    const token = localStorage.getItem("educatorToken");
    try {
      const response = await axios.put(
        `${backendUrl}/api/educator/doubts/${doubtId}/reply/${editingReplyId}`,
        { text: editReplyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Reply updated.");
        setDoubts(doubts.map(d => d._id === doubtId ? response.data.doubt : d));
        setEditingReplyId(null);
        setEditReplyText("");
      }
    } catch (error) {
      toast.error("Failed to update reply.");
    }
  };

  if (!isEducator) return <div className="p-8 text-center text-gray-500">Access Denied</div>;

  return (
    <div className="p-6 md:p-8 flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Dashboard</h1>
        <p className="text-gray-600 mb-8">Answer and moderate student questions across all your courses.</p>

        {loading ? (
          <div className="text-gray-500">Loading student questions...</div>
        ) : doubts.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border text-center text-gray-500 shadow-sm">
            No questions asked yet. You're all caught up!
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {doubts.map((doubt) => {
              const hasEducatorReplied = doubt.replies.some(r => r.userType === 'Educator');

              return (
                <div key={doubt._id} className="bg-white rounded-xl shadow-sm border p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 border-b pb-4">
                    <div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                        {doubt.courseId?.courseTitle || "Deleted Course"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 mt-2">
                        {doubt.studentName} asked:
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(doubt.createdAt).toLocaleDateString()}
                      </span>
                      {/* DELETE ENTIRE DOUBT BUTTON */}
                      <button 
                        onClick={() => handleDeleteDoubt(doubt._id)}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Delete Thread
                      </button>
                    </div>
                  </div>

    
                  <p className="text-gray-800 font-medium text-sm mb-4">
                    {doubt.questionText}
                  </p>

                  {doubt.replies && doubt.replies.length > 0 && (
                    <div className="mb-4 pl-4 border-l-2 border-gray-200 space-y-3">
                      {doubt.replies.map((reply) => (
                        <div key={reply._id} className={`p-3 rounded-md border ${reply.userType === 'Educator' ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                          
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${reply.userType === 'Educator' ? 'text-indigo-900' : 'text-gray-800'}`}>
                                {reply.name}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${reply.userType === 'Educator' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {reply.userType}
                              </span>
                            </div>
                            

                            <div className="flex gap-2">
                              {reply.userType === 'Educator' && editingReplyId !== reply._id && (
                                <button onClick={() => startEditingReply(reply._id, reply.text)} className="text-[10px] text-indigo-600 font-bold hover:underline">Edit</button>
                              )}
                              <button onClick={() => handleDeleteReply(doubt._id, reply._id)} className="text-[10px] text-red-600 font-bold hover:underline">Delete</button>
                            </div>
                          </div>


                          {editingReplyId === reply._id ? (
                            <form onSubmit={(e) => handleEditReplySubmit(e, doubt._id)} className="mt-2 flex gap-2">
                              <input
                                type="text"
                                value={editReplyText}
                                onChange={(e) => setEditReplyText(e.target.value)}
                                className="flex-1 border border-indigo-300 rounded px-2 py-1 text-sm outline-none"
                              />
                              <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold">Save</button>
                              <button type="button" onClick={() => setEditingReplyId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Cancel</button>
                            </form>
                          ) : (
                            <p className={`text-sm ${reply.userType === 'Educator' ? 'text-indigo-800' : 'text-gray-700'}`}>
                              {reply.text}
                            </p>
                          )}

                        </div>
                      ))}
                    </div>
                  )}


                  <form onSubmit={(e) => handleReplySubmit(e, doubt._id)} className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={replyTexts[doubt._id] || ""}
                      onChange={(e) => setReplyTexts({ ...replyTexts, [doubt._id]: e.target.value })}
                      placeholder={hasEducatorReplied ? "Add another reply..." : "Write your answer..."}
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!replyTexts[doubt._id]?.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md text-sm font-bold disabled:bg-indigo-400 transition-colors"
                    >
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

export default EducatorDoubts;