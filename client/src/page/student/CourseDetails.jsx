import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
      if (findCourse) setCourseData(findCourse);
    }
  }, [id, allCourses]);

  useEffect(() => {
    if (enrolledCourses?.length && courseData) {
      const isEnrolled = enrolledCourses.some(
        (item) =>
          item.courseId?._id === courseData._id ||
          item.courseId === courseData._id
      );
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [enrolledCourses, courseData]);

  const enrollCourse = async () => {
    try {
      if (!student) return toast.warn("Login to Enroll");
      if (isAlreadyEnrolled) return navigate(`/course-player/${courseData._id}`);

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
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const extractVideoId = (url) => {
    if (!url) return "";
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : "";
  };

  if (!courseData) return <Loading />;

  const rating = calculateRating(courseData);
  const discountedPrice = (
    (courseData?.coursePrice || 0) -
    ((courseData?.discount || 0) * (courseData?.coursePrice || 0)) / 100
  ).toFixed(2);

  return (
    <>
      {/* Hero Background */}
      <div className="bg-gradient-to-b from-cyan-100/70 to-white">
        <div className="flex flex-col-reverse lg:flex-row gap-10 relative items-start justify-between px-4 sm:px-8 lg:px-20 xl:px-36 pt-20 lg:pt-28 pb-10 text-left">

          {/* ─── LEFT COLUMN ─── */}
          <div className="w-full lg:max-w-xl z-10 text-gray-500">
            <h1 className="text-3xl font-semibold text-gray-800">
              {courseData?.courseTitle}
            </h1>

            <p
              className="pt-4 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: courseData?.courseDescription?.slice(0, 200) + "...",
              }}
            />

            {/* Rating Row */}
            <div className="flex items-center gap-2 pt-3 text-sm">
              <p className="text-gray-700 font-medium">{rating}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <p>({courseData?.courseRatings?.length} ratings)</p>
              <p>{courseData?.enrolledStudents?.length || 0} students</p>
            </div>

            {/* Educator */}
            <p className="pt-2 text-sm">
              Course by{" "}
              <span className="text-blue-600 underline cursor-pointer">
                {courseData?.educator?.name || "Instructor"}
              </span>
            </p>

            {/* ─── COURSE STRUCTURE ─── */}
            <div className="pt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Course Structure
              </h2>

              <div className="pt-5 space-y-2">
                {courseData?.courseContent?.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 bg-white rounded overflow-hidden"
                  >
                    {/* Chapter Header */}
                    <div
                      className="flex justify-between items-center px-4 py-3 cursor-pointer select-none hover:bg-gray-50 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.arrow_icon}
                          alt="arrow"
                          className={`w-3 transition-transform duration-300 ${
                            openSections[index] ? "rotate-90" : ""
                          }`}
                        />
                        <p className="font-medium text-gray-800">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 shrink-0 ml-4">
                        {chapter.chapterContent.length} lectures &bull;{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    {/* Lectures List */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openSections[index] ? "max-h-[1000px]" : "max-h-0"
                      }`}
                    >
                      <ul className="border-t border-gray-200">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li
                            key={i}
                            className="flex justify-between items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                          >
                            {/* Play icon + title */}
                            <div className="flex items-center gap-2">
                              <img
                                src={assets.play_icon}
                                alt="play"
                                className="w-4 h-4 opacity-70 shrink-0"
                              />
                              <span>{lecture.lectureTitle}</span>
                            </div>

                            {/* Preview button + duration */}
                            <div className="flex items-center gap-3 shrink-0 ml-4">
                              {lecture.isPreviewFree && (
                                <button
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: extractVideoId(
                                        lecture.lectureUrl
                                      ),
                                    })
                                  }
                                  className="text-blue-500 text-xs border border-blue-400 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                                >
                                  Preview
                                </button>
                              )}
                              <span className="text-gray-400 text-xs">
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
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

            {/*COURSE DESCRIPTION */}
            <div className="pt-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Course Description
              </h2>
              <p
                className="pt-4 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: courseData?.courseDescription,
                }}
              />
            </div>
          </div>

          {/*RIGHT COLUMN */}
          <div className="w-full lg:max-w-[400px] sticky top-24 z-10">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">

              
              <div className="relative w-full aspect-video bg-black">
                {playerData ? (
                  <YouTube
                    videoId={playerData.videoId}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: { autoplay: 1 },
                    }}
                    iframeClassName="absolute top-0 left-0 w-full h-full"
                  />
                ) : (
                  <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() =>
                      setPlayerData({
                        videoId: extractVideoId(courseData?.coursePreviewUrl),
                      })
                    }
                  >
                    <img
                      src={courseData?.courseThumbnail}
                      alt="thumbnail"
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 p-4 rounded-full group-hover:scale-110 transition-transform">
                        <img
                          src={assets.play_icon}
                          alt="play"
                          className="w-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
                
                <div className="flex items-center gap-2">
                  <img className="w-3.5" src={assets.time_left_icon} alt="" />
                  <p className="text-red-500 text-sm">
                    <span className="font-semibold">5 days</span> left at this
                    price!
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 pt-2">
                  <p className="text-gray-800 text-3xl font-bold">
                    {currency}
                    {discountedPrice}
                  </p>
                  <p className="text-gray-400 line-through text-lg">
                    {currency}
                    {courseData?.coursePrice?.toFixed(2)}
                  </p>
                  {courseData?.discount > 0 && (
                    <p className="text-green-600 text-sm font-semibold">
                      {courseData.discount}% off
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center text-sm gap-4 pt-3 text-gray-500">
                  <div className="flex items-center gap-1">
                    <img src={assets.star} alt="" className="w-4" />
                    <p>{rating}</p>
                  </div>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <img src={assets.time_clock_icon} alt="" className="w-4" />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <img src={assets.lesson_icon} alt="" className="w-4" />
                    <p>{calculateNoOfLectures(courseData)} lessons</p>
                  </div>
                </div>

                
                <button
                  onClick={enrollCourse}
                  className="mt-5 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {isAlreadyEnrolled ? "Go to Course →" : "Enroll Now"}
                </button>

                
                <div className="pt-5">
                  <p className="font-semibold text-gray-800 text-sm">
                    What's in the course?
                  </p>
                  <ul className="pt-2 space-y-1.5 text-sm text-gray-600 list-disc list-inside">
                    <li>Lifetime access with free updates.</li>
                    <li>Step-by-step, hands-on project guidance.</li>
                    <li>Downloadable resources and source code.</li>
                    <li>Quizzes to test your knowledge.</li>
                    <li>Certificate of completion.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;