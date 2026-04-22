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
  const [loading, setLoading] = useState(true);


  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [finalDisplayPrice, setFinalDisplayPrice] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const {
    calculateRating,
    calculateCourseDuration,
    calculateNoOfLectures,
    calculateChapterTime,
    currency,
    backendUrl,
    student,
    enrolledCourses,
    fetchUserEnrolledCourses
  } = useContext(AppContext);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
        if (data.success) {
          setCourseData(data.courseData);
          
          const baseDiscountAmount = (data.courseData.coursePrice * data.courseData.discount) / 100;
          setFinalDisplayPrice(data.courseData.coursePrice - baseDiscountAmount);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id, backendUrl]);

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

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return toast.warn("Please enter a coupon code");
    
    try {
      setIsApplyingCoupon(true);
      const { data } = await axios.post(`${backendUrl}/api/course/validate-coupon`, {
        code: couponInput,
        courseId: courseData._id
      });

      if (data.success) {
        toast.success(data.message);
        setAppliedCoupon(data.couponDetails);
        setFinalDisplayPrice(data.couponDetails.finalPrice);
      } else {
        toast.error(data.message);
        removeCoupon();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    const baseDiscountAmount = (courseData.coursePrice * courseData.discount) / 100;
    setFinalDisplayPrice(courseData.coursePrice - baseDiscountAmount);
  };

  const enrollCourse = async () => {
    try {
      if (!student) return toast.warn("Login to Enroll");
      if (isAlreadyEnrolled) return navigate(`/player/${courseData._id}`);

      const token = localStorage.getItem("studentToken");

     
      if (finalDisplayPrice === 0 || appliedCoupon?.isFree) {
        const { data } = await axios.post(
          `${backendUrl}/api/students/enroll-free`, 
          { 
            courseId: courseData._id, 
            couponCode: appliedCoupon?.code 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("Enrolled successfully for free!");
          setIsAlreadyEnrolled(true);
          
          // 🚨 THE MISSING LINE: Update the global state BEFORE navigating 🚨
          await fetchUserEnrolledCourses(); 
          
          navigate(`/player/${courseData._id}`);
        } else {
          toast.error(data.message);
        }
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/students/purchase`,
        { 
          courseId: courseData._id,
          couponCode: appliedCoupon?.code 
        },
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
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : "";
  };

  if (loading) return <Loading />;
  if (!courseData) return <Loading />;

  const rating = calculateRating(courseData);

  return (
    <>
      <div className="bg-gradient-to-b from-cyan-100/70 to-white min-h-screen">
        <div className="flex flex-col-reverse lg:flex-row gap-10 relative items-start justify-between px-4 sm:px-8 lg:px-20 xl:px-36 pt-20 lg:pt-28 pb-10 text-left">

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

            <div className="flex flex-wrap items-center gap-2 pt-3 text-sm">
              <p className="text-yellow-600 font-semibold">{rating}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <p>({courseData?.courseRatings?.length} ratings)</p>
              <p>{courseData?.enrolledStudents?.length || 0} students</p>
            </div>

            <p className="pt-2 text-sm">
              Course by{" "}
              <span className="text-blue-600 underline cursor-pointer">
                {courseData?.educator?.name || "Instructor"}
              </span>
            </p>

         
            <div className="pt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Course Structure
              </h2>

              <p className="text-sm text-gray-500 pt-1">
                {courseData?.courseContent?.length} sections &bull;{" "}
                {calculateNoOfLectures(courseData)} lectures &bull;{" "}
                {calculateCourseDuration(courseData)} total length
              </p>

              <div className="pt-4 space-y-2">
                {courseData?.courseContent?.length > 0 ? (
                  courseData.courseContent.map((chapter, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 bg-white rounded overflow-hidden"
                    >
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
                          <p className="font-medium text-gray-800 text-sm">
                            {chapter.chapterTitle}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 shrink-0 ml-4">
                          {chapter.chapterContent?.length} lectures &bull;{" "}
                          {calculateChapterTime(chapter)}
                        </p>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openSections[index] ? "max-h-[1000px]" : "max-h-0"
                        }`}
                      >
                        <ul className="border-t border-gray-200 divide-y divide-gray-100">
                          {chapter.chapterContent?.map((lecture, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center px-4 py-3 text-sm"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {lecture.isPreviewFree ? (
                                  <img
                                    src={assets.play_icon}
                                    alt="preview"
                                    className="w-4 h-4 shrink-0"
                                  />
                                ) : (
                                  <svg
                                    className="w-4 h-4 shrink-0 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                <span
                                  className={`truncate ${
                                    lecture.isPreviewFree
                                      ? "text-gray-700"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {lecture.lectureTitle}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 ml-4">
                                {lecture.isPreviewFree && (
                                  <button
                                    onClick={() =>
                                      setPlayerData({
                                        videoId:
                                          lecture.videoType === "youtube"
                                            ? extractVideoId(lecture.youtubeUrl)
                                            : extractVideoId(lecture.videoUrl),
                                        videoType: lecture.videoType,
                                        videoUrl: lecture.videoUrl,
                                      })
                                    }
                                    className="text-blue-500 text-xs border border-blue-400 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className="text-gray-400 text-xs whitespace-nowrap">
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
                  ))
                ) : (
                  <p className="text-sm text-gray-400 pt-2">
                    No course content available yet.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-10 pb-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Course Description
              </h2>
              <p
                className="pt-4 text-sm leading-relaxed rich-text"
                dangerouslySetInnerHTML={{
                  __html: courseData?.courseDescription,
                }}
              />
            </div>
          </div>

          <div className="w-full lg:max-w-[400px] sticky top-24 z-10">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
              <div className="relative w-full aspect-video bg-black">
                {playerData ? (
                  playerData.videoType === "upload" ? (
                    <video
                      src={playerData.videoUrl}
                      controls
                      autoPlay
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  ) : (
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: { autoplay: 1 },
                      }}
                      iframeClassName="absolute top-0 left-0 w-full h-full"
                    />
                  )
                ) : (
                  <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => {
                      const previewUrl = courseData?.coursePreviewUrl;
                      if (previewUrl) {
                        setPlayerData({
                          videoId: extractVideoId(previewUrl),
                          videoType: "youtube",
                        });
                      }
                    }}
                  >
                    <img
                      src={courseData?.courseThumbnail}
                      alt="thumbnail"
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 p-4 rounded-full group-hover:scale-110 transition-transform">
                        <img src={assets.play_icon} alt="play" className="w-8" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
            
                <div className="flex items-end gap-3 pt-2">
                  <p className="text-gray-800 text-3xl font-bold">
                    {finalDisplayPrice === 0 ? "Free" : `${currency}${finalDisplayPrice.toFixed(2)}`}
                  </p>
                  
                  {(courseData?.discount > 0 || appliedCoupon) && finalDisplayPrice !== courseData.coursePrice && (
                    <p className="text-gray-400 line-through text-lg mb-0.5">
                      {currency}{courseData?.coursePrice?.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* --- COUPON INPUT FIELD --- */}
                {!isAlreadyEnrolled && (
                  <div className="pt-5 pb-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        <div>
                          <span className="font-semibold block">Coupon Applied!</span>
                          <span className="text-xs text-green-600">{appliedCoupon.code} ({appliedCoupon.discountPercentage}% off)</span>
                        </div>
                        <button 
                          onClick={removeCoupon} 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Have a coupon code?"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                        />
                        <button 
                          onClick={handleApplyCoupon} 
                          disabled={isApplyingCoupon}
                          className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:bg-gray-400"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

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
                  {isAlreadyEnrolled ? "Go to Course →" : finalDisplayPrice === 0 ? "Enroll for Free" : "Enroll Now"}
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