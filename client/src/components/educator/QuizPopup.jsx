import React, { useState } from "react";
import { toast } from "react-toastify";

const QuizPopup = ({ setShowQuizPopup, onSaveQuiz, chapterId }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const addQuestionToList = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some((opt) => opt.trim() === "")) {
      return toast.error("Please fill the question and all 4 options");
    }
    setQuestions((prev) => [...prev, newQuestion]);
    
    
    setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
  };

  const handleFinalSave = () => {
    if (!quizTitle.trim() || questions.length === 0) {
      return toast.error("Quiz needs a title and at least one question.");
    }

    const quizData = { quizTitle, questions };

    onSaveQuiz(quizData);
    toast.success("Quiz added to chapter curriculum!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Create Chapter Quiz</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
          <input
            type="text"
            placeholder="e.g. JavaScript Basics Assessment"
            className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <p className="font-bold text-sm mb-2 text-gray-600">Question Builder</p>
          <input
            type="text"
            placeholder="Question text"
            className="w-full border p-2 mb-3 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          />

          <div className="grid grid-cols-1 gap-2">
            {newQuestion.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  checked={newQuestion.correctAnswer === i}
                  onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: i })}
                />
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 border p-1.5 text-sm rounded outline-none focus:ring-1 focus:ring-blue-500"
                  value={opt}
                  onChange={(e) => {
                    const opts = [...newQuestion.options];
                    opts[i] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: opts });
                  }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestionToList}
            className="mt-4 w-full bg-blue-50 text-blue-600 border border-blue-200 py-1.5 text-xs font-bold rounded hover:bg-blue-100 transition"
          >
            + Push Question to Quiz
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">
            Queue ({questions.length} Questions)
          </p>
          <div className="max-h-32 overflow-y-auto mt-2 space-y-1">
            {questions.map((q, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-gray-600 bg-white p-2 border rounded">
                <span className="truncate">Q{idx + 1}: {q.question}</span>
                <span className="text-green-600 font-bold">Ans: {q.correctAnswer + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleFinalSave}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 shadow-md transition"
          >
            Save to Chapter
          </button>
          <button
            onClick={() => setShowQuizPopup(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;