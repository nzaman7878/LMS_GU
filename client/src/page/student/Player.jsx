import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import humanizeDuration from "humanize-duration";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import YouTube from "react-youtube";
import Footer from "../../components/students/Footer";
import Rating from "../../components/students/Rating";

const Player = () => {

  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getCourseData = () => {
    const course = enrolledCourses?.find(course => course._id === courseId);
    setCourseData(course || null);
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses, courseId]);

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">

        
        <div className="text-gray-800">

          <h2 className="text-xl font-semibold">Course Structure</h2>

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

                            {lecture?.lectureUrl && (
                              <p
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1
                                  });
                                }}
                                className="text-blue-500 cursor-pointer hover:underline"
                              >
                                Watch
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

          =
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course :</h1>
            <Rating
              initialRating={0}
              onRate={(rating) => console.log(rating)}
            />
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="md:mt-10">

          {playerData ? (

            <div>

              <YouTube
                videoId={playerData?.lectureUrl?.split("/").pop() || ""}
                opts={{
                  playerVars: {
                    autoplay: 1,
                  }
                }}
                iframeClassName="w-full aspect-video"
              />

              <div className="flex justify-between items-center mt-1">

                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>

                <button className="text-blue-600">
                  Mark Complete
                </button>

              </div>

            </div>

          ) : (

            <img
              src={courseData?.courseThumbnail || ""}
              alt=""
              className="w-full"
            />

          )}

        </div>

      </div>

      <Footer />

    </>
  );
};

export default Player;