import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/students/Loading";
import Footer from "../../components/students/Footer";
import YouTube from "react-youtube";
import { assets } from "../../assets/assets";

import TakeQuiz from "../../components/students/TakeQuiz";
import DoubtSection from "../../components/students/DoubtSection";

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

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);

        const userRating = course.courseRatings?.find(
          (item) => item.userId === student?._id,
        );

        if (userRating) {
          setInitialRating(userRating.rating);
        }
      }
    });
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        `${backendUrl}/api/students/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        `${backendUrl}/api/students/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        `${backendUrl}/api/students/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } },
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
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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
  }, [enrolledCourses, student]);

  useEffect(() => {
    getCourseProgress();
  }, []);

  if (!courseData) return <Loading />;

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        <div className="text-gray-800">
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
                      const isCompleted =
                        progressData?.lectureCompleted?.includes(
                          lecture.lectureId,
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
                                lecture.resources.map((res, idx) => (
                                  <a
                                    key={idx}
                                    href={res.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-green-600 font-bold hover:underline"
                                  >
                                    {res.title}
                                  </a>
                                ))}
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
                            playerData.lectureId,
                          )
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {progressData?.lectureCompleted?.includes(
                          playerData.lectureId,
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
              <DoubtSection courseId={courseId} lectureId={playerData.lectureId} />
            )}
            
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Player;