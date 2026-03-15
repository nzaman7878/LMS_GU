import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets.js";
import humanizeDuration from "humanize-duration";
import VideoPlayer from "../../components/students/VideoPlayer";

const CourseDetails = () => {

  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allcourses,
    calculateRating,
    calculateCourseDuration,
    calculateNoOfLectures,
    calculateChapterTime,
    currency
  } = useContext(AppContext);

  useEffect(() => {
    const findCourse = allcourses?.find(course => course._id === id);
    setCourseData(findCourse);
  }, [id, allcourses]);

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!courseData) return <Loading />;

  return (

    <div className="flex flex-col-reverse lg:flex-row gap-10 relative items-start justify-between px-4 sm:px-8 lg:px-20 xl:px-36 pt-20 lg:pt-28 text-left">

      <div className="absolute top-0 left-0 w-full h-[300px] md:h-section-height -z-10 bg-gradient-to-b from-cyan-100/70"></div>

      
      <div className="w-full lg:max-w-xl z-10 text-gray-500">

        
        <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
          {courseData?.courseTitle}
        </h1>

        
        <p
          className="pt-4 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: courseData?.courseDescription?.slice(0, 200) + "..."
          }}
        />

        
        <div className="flex flex-wrap items-center gap-2 pt-3 pb-1 text-sm">

          <p className="font-medium">
            {calculateRating(courseData)}
          </p>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>

          <p className="text-gray-500">
            ({courseData?.courseRatings?.length}{" "}
            {courseData?.courseRatings?.length > 1 ? "ratings" : "rating"})
          </p>

          <p>
            {courseData?.enrolledStudents?.length}
            {courseData?.enrolledStudents?.length > 1
              ? " students enrolled"
              : " student enrolled"}
          </p>

        </div>

        
        <p className="text-sm">
          Course by
          <span className="text-blue-600 underline">
            {" "}{courseData?.instructorName}
          </span>
        </p>

      
        <div className="pt-8 text-gray-800">

          <h2 className="text-xl font-semibold">
            Course Structure
          </h2>

          <div className="pt-5">

            {courseData?.courseContent?.map((chapter, index) => (

              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >

               
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >

                  <div className="flex items-center gap-2">

                    <img
                      className={`transform transition-transform duration-300 ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt=""
                    />

                    <p className="font-medium md:text-base text-sm">
                      {chapter?.chapterTitle}
                    </p>

                  </div>

                  <p className="text-sm md:text-default">
                    {chapter?.chapterContent?.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>

                </div>

                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-[500px]" : "max-h-0"
                  }`}
                >

                  <ul className="list-disc md:pl-10 pr-4 py-2 text-gray-600 border-t border-gray-300">

                    {chapter?.chapterContent?.map((lecture, i) => (

                      <li
                        key={i}
                        className="flex items-start gap-2 px-4 sm:px-6 py-2"
                      >

                        <img
                          src={assets.play_icon}
                          alt="play"
                          className="w-4 h-4 mt-1"
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-gray-800 text-xs md:text-default gap-1">

                          <p>{lecture?.lectureTitle}</p>

                          <div className="flex gap-2 items-center">

                            {lecture?.isPreviewFree && (
                              <p
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlayerData({
                                    videoId: lecture?.lectureUrl?.split("/")?.pop() || ""
                                  });
                                }}
                                className="text-blue-500 cursor-pointer hover:underline"
                              >
                                Preview
                              </p>
                            )}

                            <p>
                              {humanizeDuration(
                                (lecture?.lectureDuration || 0) * 60 * 1000,
                                {
                                  units: ["m", "s"],
                                  delimiter: " "
                                }
                              )}
                            </p>

                          </div>

                        </div>

                      </li>

                    ))}

                  </ul>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* COURSE DESCRIPTION */}
        <div className="py-16 text-sm md:text-default">

          <h3 className="text-xl font-semibold text-gray-800">
            Course Description
          </h3>

          <p
            className="pt-3 rich-text text-gray-600"
            dangerouslySetInnerHTML={{
              __html: courseData?.courseDescription
            }}
          />

        </div>

      </div>

     
      <div className="w-full lg:max-w-course-card lg:sticky lg:top-24 z-10 shadow-custom-card rounded-lg overflow-hidden bg-white">

        <img src={courseData?.courseThumbnail} alt="course thumbnail" />

        <div className="p-5">

          {playerData && (
            <div className="mb-4">
              <VideoPlayer data={playerData} />
            </div>
          )}

         
          <div className="flex items-center gap-2">
            <img className="w-3.5" src={assets.time_left_icon} alt="" />
            <p className="text-red-500">
              <span className="font-medium">5 days</span> left at this price!
            </p>
          </div>

          
          <div className="flex flex-wrap gap-3 items-center pt-2">

            <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
              {currency}
              {(courseData?.coursePrice - (courseData?.discount * courseData?.coursePrice) / 100).toFixed(2)}
            </p>

            <p className="md:text-lg text-gray-500 line-through">
              {currency}{courseData?.coursePrice?.toFixed(2)}
            </p>

            <p className="md:text-lg text-gray-500">
              {courseData?.discount?.toFixed(2)}% off
            </p>

          </div>

          
          <div className="flex flex-wrap items-center text-sm md:text-default gap-4 pt-3 text-gray-500">

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

          {/* Enroll Button */}
          <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-medium">
            {isAlreadyEnrolled ? "Go to Course" : "Enroll Now"}
          </button>

          
          <div className="pt-6 text-gray-600 text-sm md:text-default">

            <p className="md:text-xl text-lg font-medium text-gray-800">
              What's in the course?
            </p>

            <ul className="ml-4 pt-2 list-disc text-gray-500">
              <li>Lifetime access with free updates</li>
              <li>Step by Step, hands-on project guidance</li>
              <li>Downloadable resources and code</li>
              <li>Quizzes to test your knowledge</li>
              <li>Certificate of completion</li>
            </ul>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CourseDetails;