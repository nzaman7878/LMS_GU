import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TakeQuiz = ({ quiz, courseId, progressData, getCourseProgress, backendUrl }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userAnswers, setUserAnswers] = useState([]);

  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    if (!quiz?.quizId) return;

    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowScore(false);
    setScore(0);
    
    const currentQuizProgress = progressData?.quizProgress?.find(
      (q) => q.quizId === quiz.quizId
    );

    const dbAttempts = currentQuizProgress?.attempts || 0;
    const dbBestScore = currentQuizProgress?.bestScore || 0;
    
    
    const dbAnswers = currentQuizProgress?.userAnswers || []; 

    setAttempts(dbAttempts);
    setBestScore(dbBestScore);
    setUserAnswers(dbAnswers);

    if (dbAttempts >= 1) {
      setScore(dbBestScore);
      setShowScore(true);
    }
  }, [quiz, progressData]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = async () => {
    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);

    let currentScore = score;
    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      currentScore += 1;
      setScore(currentScore);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
    } else {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem("studentToken");
        const { data } = await axios.post(
          `${backendUrl}/api/students/submit-quiz`,
          {
            courseId,
            quizId: quiz.quizId,
            score: currentScore,
            userAnswers: updatedAnswers, 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("Quiz submitted!");
          await getCourseProgress();
          setShowScore(true);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="p-8 text-center text-gray-500">No questions available.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
      {showScore ? (
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>

          <p className="text-xl text-gray-600 mb-6">
            Score: <span className="font-bold text-blue-600">{score}</span> out of{" "}
            {quiz.questions.length}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-10">
            <div
              className={`h-4 rounded-full ${
                score / quiz.questions.length >= 0.5 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${(score / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="text-left border-t pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Review Answers</h3>
            <div className="space-y-6">
              {quiz.questions.map((q, qIdx) => {
                const studentAnswerIndex = userAnswers[qIdx];

                return (
                  <div key={qIdx} className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-semibold text-gray-800 mb-4">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const isCorrectAnswer = optIdx === q.correctAnswer;
                        const isStudentWrongAnswer = studentAnswerIndex === optIdx && !isCorrectAnswer;

                        let styleClass = "p-3 rounded-md text-sm text-gray-600 border border-transparent";
                        
                        if (isCorrectAnswer) {
                          styleClass = "p-3 rounded-md text-sm font-bold bg-green-100 text-green-800 border border-green-300";
                        } 
                        else if (isStudentWrongAnswer) {
                          styleClass = "p-3 rounded-md text-sm font-bold bg-red-100 text-red-800 border border-red-300 opacity-70";
                        }

                        return (
                          <div key={optIdx} className={styleClass}>
                            <span className="inline-block w-6 font-bold mr-2">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {option}
                            {isCorrectAnswer && <span className="ml-2 float-right">✅ Correct</span>}
                            {isStudentWrongAnswer && <span className="ml-2 float-right">❌ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{quiz.quizTitle}</h2>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg text-gray-700 font-medium mb-4">
              {quiz.questions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedOption === index
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <span className="inline-block w-6 h-6 rounded-full border border-current text-center leading-5 mr-3 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                selectedOption !== null && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Saving..."
                : currentQuestion === quiz.questions.length - 1
                ? "Submit Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;