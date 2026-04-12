import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets.js";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/students/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const {
    allCourses,
    calculateRating,
    calculateCourseDuration,
    calculateNoOfLectures,
    calculateChapterTime,
    currency,
    backendUrl,
    student,
    enrolledCourses,
    
  } = useContext(AppContext);


  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const findCourse = allCourses.find((course) => course._id === id);
      if (findCourse) {
        setCourseData(findCourse);
      }
    }
  }, [id, allCourses]);

 
  useEffect(() => {
    if (enrolledCourses && courseData) {
      // Safe check using optional chaining to prevent the '_id' of undefined error
      const isEnrolled = enrolledCourses.some(
        (item) => item.courseId?._id === courseData._id || item.courseId === courseData._id
      );
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [enrolledCourses, courseData]);

  const enrollCourse = async () => {
    try {
      if (!student) {
        return toast.warn("Login to Enroll");
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled");
      }

      const token = localStorage.getItem("studentToken");

      const { data } = await axios.post(
        backendUrl + "/api/students/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const extractVideoId = (url) => {
    if (!url) return "";
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : "";
  };

  if (!courseData) return <Loading />;

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-10 relative items-start justify-between px-4 sm:px-8 lg:px-20 xl:px-36 pt-20 lg:pt-28 text-left">
        {/* Left Column */}
        <div className="w-full lg:max-w-xl z-10 text-gray-500">
          <h1 className="text-2xl font-semibold text-gray-800">
            {courseData?.courseTitle}
          </h1>

          <p
            className="pt-4 text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData?.courseDescription?.slice(0, 200) + "...",
            }}
          />

          <div className="flex items-center gap-2 pt-3 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
            </div>
            <p>({courseData?.courseRatings?.length} ratings)</p>
          </div>

          <div className="pt-8">
            <h2 className="text-xl font-semibold text-gray-800">Course Structure</h2>
            <div className="pt-5">
              {courseData?.courseContent?.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  <div
                    className="flex justify-between px-4 py-3 cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <p className="font-medium">{chapter.chapterTitle}</p>
                    <p className="text-sm">
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <ul className="pl-6 py-2 border-t">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex justify-between py-2 text-sm">
                          <span>{lecture.lectureTitle}</span>
                          <div className="flex gap-3">
                            {lecture.isPreviewFree && (
                              <button
                                className="text-blue-600"
                                onClick={() =>
                                  setPlayerData({
                                    videoId: extractVideoId(lecture.lectureUrl),
                                  })
                                }
                              >
                                Preview
                              </button>
                            )}
                            <span>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                units: ["m", "s"],
                              })}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="w-full lg:max-w-[400px] sticky top-24">
          <div className="relative w-full aspect-video bg-black overflow-hidden rounded">
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ width: "100%", height: "100%", playerVars: { autoplay: 1 } }}
                iframeClassName="absolute top-0 left-0 w-full h-full"
              />
            ) : (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() =>
                  setPlayerData({
                    videoId: extractVideoId(courseData?.coursePreviewUrl),
                  })
                }
              >
                <img
                  src={courseData?.courseThumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 p-4 rounded-full">
                    <img src={assets.play_icon} alt="play" className="w-8" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <img className="w-3.5" src={assets.time_left_icon} alt="" />
            <p className="text-red-500">
              <span className="font-medium">5 days</span> left at this price!
            </p>
          </div>

          <div className="flex gap-3 items-center pt-2">
            <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
              {currency}
              {(
                (courseData?.coursePrice || 0) -
                ((courseData?.discount || 0) * (courseData?.coursePrice || 0)) / 100
              ).toFixed(2)}
            </p>
            <p className="md:text-lg text-gray-500 line-through">
              {currency} {courseData?.coursePrice?.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center text-sm gap-4 pt-4 text-gray-500">
            <div className="flex items-center gap-1">
              <img src={assets.star} alt="" />
              <p>{calculateRating(courseData)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.time_clock_icon} alt="" />
              <p>{calculateCourseDuration(courseData)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.lesson_icon} alt="" />
              <p>{calculateNoOfLectures(courseData)} lessons</p>
            </div>
          </div>

          <button 
            onClick={enrollCourse}
            className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium"
          >
            {isAlreadyEnrolled ? "Go to Course" : "Enroll Now"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;