import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/students/Loading";

import YouTube from "react-youtube";
import { assets } from "../../assets/assets";

import TakeQuiz from "../../components/students/TakeQuiz";
import DoubtSection from "../../components/students/DoubtSection";
import AssignmentSection from "./AssignmentSection";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    student,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [activeTab, setActiveTab] = useState("doubts");

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);

        const userRating = course.courseRatings?.find(
          (item) => item.userId === student?._id
        );

        if (userRating) {
          setInitialRating(userRating.rating);
        }
      }
    });
  };

  const getCourseProgress = async () => {
    try {
      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        `${backendUrl}/api/students/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        `${backendUrl}/api/students/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadCertificate = async (type = 'standard') => {
    try {
      const token = localStorage.getItem("studentToken");
      const toastId = toast.loading(`Generating your ${type} certificate...`);

      const response = await axios.get(
        `${backendUrl}/api/students/certificate/${courseId}?type=${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", 
        }
      );

      if (response.data.type === "application/json") {
        const textData = await response.data.text();
        const errorData = JSON.parse(textData);
        throw new Error(errorData.message || "Failed to download certificate.");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      const safeTitle = (courseData?.courseTitle || "Course").replace(/[^a-zA-Z0-9]/g, "_");
      link.setAttribute("download", `${safeTitle}_${type.toUpperCase()}_Certificate.pdf`);
      
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.update(toastId, {
        render: `${type.charAt(0).toUpperCase() + type.slice(1)} Certificate downloaded!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Certificate Download Error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to download certificate.");
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        `${backendUrl}/api/students/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setInitialRating(rating);
        fetchUserEnrolledCourses();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url.split("/").pop();
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses, student, courseId]);

  useEffect(() => {
    if (courseId) {
      getCourseProgress();
    }
  }, [courseId]);


  const totalLectures = courseData?.courseContent?.reduce(
    (acc, chapter) => acc + (chapter.chapterContent?.length || 0),
    0
  ) || 0;

  const completedLecturesCount = progressData?.lectureCompleted?.length || 0;
  const isCourseComplete = progressData?.completed || (totalLectures > 0 && completedLecturesCount === totalLectures);
  

  if (!courseData) return <Loading />;

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        <div className="text-gray-800">
          
          {/* --- PROGRESS TRACKER & CERTIFICATE BANNER --- */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-600">Course Progress</p>
              <p className="text-sm font-bold text-blue-600">
                {completedLecturesCount} / {totalLectures} Lectures
              </p>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${totalLectures > 0 ? (completedLecturesCount / totalLectures) * 100 : 0}%` }}
              ></div>
            </div>

            {/* Certificate Unlock Banner */}
            {isCourseComplete && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm flex flex-col items-center text-center animate-fade-in">
                <h3 className="text-xl font-bold text-green-800 mb-1">🎉 Congratulations!</h3>
                <p className="text-sm text-green-600 mb-6">You have successfully completed all lectures in this course.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  {/* Standard Button */}
                  <button
                    onClick={() => handleDownloadCertificate('standard')}
                    className="bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-6 rounded-full transition-all flex justify-center items-center gap-2 shadow-sm hover:shadow active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Standard Certificate
                  </button>

                  {/* Premium Button */}
                  <button
                    onClick={() => handleDownloadCertificate('premium')}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-medium py-2.5 px-6 rounded-full transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                    Premium Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* --------------------------- */}

          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData?.courseContent?.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`w-3 transition-transform ${openSections[index] ? "rotate-180" : ""}`}
                      src={assets.down_arrow_icon}
                      alt=""
                    />
                    <p className="font-medium">{chapter?.chapterTitle}</p>
                  </div>

                  <p className="text-xs text-gray-500">
                    {chapter?.chapterContent?.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`transition-all duration-300 ${
                    openSections[index] ? "max-h-[2000px]" : "max-h-0"
                  } overflow-hidden`}
                >
                  <ul className="border-t border-gray-200">
                    {chapter?.chapterContent?.map((lecture, i) => {
                      const isCompleted = progressData?.lectureCompleted?.includes(
                        lecture.lectureId
                      );

                      return (
                        <li
                          key={i}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 border-b"
                        >
                          <img
                            src={
                              isCompleted
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            className="w-4 h-4 mt-1"
                            alt=""
                          />

                          <div className="flex flex-col w-full">
                            <div className="flex justify-between text-sm">
                              <p className="font-medium">
                                {lecture?.lectureTitle}
                              </p>
                              <p className="text-gray-400">
                                {lecture.lectureDuration}m
                              </p>
                            </div>

                            <div className="flex gap-4 mt-1 text-xs flex-wrap">
                              <button
                                onClick={() =>
                                  setPlayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                    contentType: "video",
                                  })
                                }
                                className="text-blue-600 font-bold hover:underline"
                              >
                                Watch
                              </button>

                              {lecture.resources?.length > 0 &&
                                lecture.resources.map((res, idx) => {
                                  const cleanUrl = res.fileUrl?.replace('/fl_attachment', '') || '#';

                                  const handleDownload = async () => {
                                    try {
                                      const response = await fetch(cleanUrl);
                                      if (!response.ok) throw new Error("Fetch failed");
                                      const blob = await response.blob();
                                      const blobUrl = URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = blobUrl;
                                      link.download = res.title || 'Resource_File';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(blobUrl);
                                    } catch (err) {
                                      console.error('Download failed, opening in new tab:', err);
                                      window.open(cleanUrl, '_blank');
                                    }
                                  };

                                  return (
                                    <button
                                      key={idx}
                                      onClick={handleDownload}
                                      className="text-green-600 font-bold hover:underline cursor-pointer"
                                    >
                                      📄 {res.title || "Resource File"} (Download)
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {chapter?.quizzes && chapter.quizzes.length > 0 && (
                    <ul className="bg-purple-50/30">
                      {chapter.quizzes.map((quiz, qIdx) => (
                        <li
                          key={quiz.quizId}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 border-b border-purple-100"
                        >
                          <span className="text-lg leading-none mt-0.5">
                            📝
                          </span>

                          <div className="flex flex-col w-full">
                            <div className="flex justify-between text-sm">
                              <p className="font-medium text-purple-800">
                                {quiz.quizTitle}
                              </p>
                              <p className="text-purple-400">
                                {quiz.questions?.length} Qs
                              </p>
                            </div>

                            <div className="flex gap-4 mt-1 text-xs flex-wrap">
                              <button
                                onClick={() =>
                                  setPlayerData({
                                    ...quiz,
                                    chapter: index + 1,
                                    contentType: "quiz",
                                  })
                                }
                                className="text-purple-600 font-bold hover:underline"
                              >
                                Take Quiz
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 py-3 mt-10 border-t pt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <img
                  key={star}
                  onClick={() => handleRate(star)}
                  src={star <= initialRating ? assets.star : assets.star_blank}
                  className="w-5 cursor-pointer"
                  alt=""
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit">
          <div className="md:sticky md:top-10">
            {playerData ? (
              <div className="bg-white rounded shadow-lg p-2">
                {playerData.contentType === "quiz" ? (
                  <TakeQuiz
                    quiz={playerData}
                    courseId={courseId}
                    progressData={progressData}
                    getCourseProgress={getCourseProgress}
                    backendUrl={backendUrl}
                  />
                ) : (
                  <>
                    {playerData.videoType === "youtube" ? (
                      <YouTube
                        videoId={getYouTubeId(playerData.youtubeUrl)}
                        opts={{ playerVars: { autoplay: 1 } }}
                        iframeClassName="w-full aspect-video"
                      />
                    ) : (
                      <video
                        src={playerData.videoUrl}
                        controls
                        autoPlay
                        className="w-full rounded"
                      />
                    )}

                    <div className="flex justify-between items-center mt-4 px-2 pb-2">
                      <p className="font-bold text-gray-800">
                        {playerData.chapter}.{playerData.lecture}{" "}
                        {playerData.lectureTitle}
                      </p>

                      <button
                        onClick={() =>
                          markLectureAsCompleted(playerData.lectureId)
                        }
                        className={`font-medium px-3 py-1.5 rounded-md transition ${
                          progressData?.lectureCompleted?.includes(
                            playerData.lectureId
                          )
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {progressData?.lectureCompleted?.includes(
                          playerData.lectureId
                        )
                          ? "✓ Completed"
                          : "Mark Complete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-100 rounded shadow flex items-center justify-center relative overflow-hidden group">
                <img
                  src={courseData?.courseThumbnail}
                  className="w-full h-full object-cover opacity-60"
                  alt=""
                />
                <p className="absolute text-gray-700 font-semibold bg-white/80 px-4 py-2 rounded-lg shadow-sm backdrop-blur-sm">
                  Select a lecture or quiz to start learning
                </p>
              </div>
            )}

            {playerData && playerData.contentType === "video" && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                
                <div className="flex border-b bg-gray-50">
                  <button 
                    onClick={() => setActiveTab('doubts')} 
                    className={`flex-1 py-3 font-semibold text-sm transition-all ${activeTab === 'doubts' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Doubts & Q&A
                  </button>
                  <button 
                    onClick={() => setActiveTab('assignments')} 
                    className={`flex-1 py-3 font-semibold text-sm transition-all ${activeTab === 'assignments' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    Assignments
                  </button>
                </div>
                
                <div className="p-4 md:p-6 bg-gray-50/30">
                  {activeTab === 'doubts' ? (
                    <DoubtSection courseId={courseId} lectureId={playerData.lectureId} />
                  ) : (
                    <AssignmentSection lectureId={playerData.lectureId} />
                  )}
                </div>

              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;