import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const { backendUrl, student } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey! I'm your AI learning assistant. Ask me anything about your courses. ✦", time: now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

 
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text, time: now() }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("studentToken");
      const { data } = await axios.post(
        `${backendUrl}/api/students/chatbot/ask`,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply, time: now() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I'm having trouble connecting right now.", time: now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      
   
      {isOpen && (
        <div className="w-[340px] h-[520px] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out">
          
        
          <div className="bg-gray-50 border-b border-gray-200 p-3.5 flex items-center gap-3 shrink-0">
          
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md shrink-0">
              ✦
            </div>
           
            <div className="flex-1">
              <h3 className="text-[13px] font-bold text-gray-800 tracking-wide">Learning Assistant</h3>
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online · always here
              </div>
            </div>


            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col gap-1 max-w-[85%] shrink-0 ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
              >
                <div className={`p-3 text-[13px] leading-relaxed break-words shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl rounded-br-sm" 
                    : "bg-gray-100 text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm"
                }`}>
   
                  {msg.sender === "ai" ? (
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-mono px-1 font-medium">{msg.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="self-start max-w-[85%] shrink-0 flex flex-col gap-1">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-sm py-3.5 px-4 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} className="bg-gray-50 border-t border-gray-200 p-3 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50 shadow-sm"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className={`w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-all ${
                isLoading || !input.trim() 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30"
              }`}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

  
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[52px] h-[52px] bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-[15px] flex items-center justify-center shadow-xl hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-200"
      >
        <span className={isOpen ? "text-[22px]" : "text-[26px]"}>
          {isOpen ? "✕" : "✦"}
        </span>
      </button>
    </div>
  );
};

export default Chatbot;