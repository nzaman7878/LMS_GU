import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
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

 
  const getYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.split("/").pop();
  };

  const toggleSection = (index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const course = enrolledCourses?.find(c => c._id === courseId);
    setCourseData(course || null);
  }, [enrolledCourses, courseId]);

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData?.courseContent?.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded overflow-hidden">
                <div 
                   className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50"
                   onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img className={`w-3 transition-transform ${openSections[index] ? "rotate-180" : ""}`} src={assets.down_arrow_icon} alt="" />
                    <p className="font-medium text-sm md:text-base">{chapter?.chapterTitle}</p>
                  </div>
                  <p className="text-xs text-gray-500">{chapter?.chapterContent?.length} lectures - {calculateChapterTime(chapter)}</p>
                </div>

                <div className={`transition-all duration-300 ${openSections[index] ? "max-h-[1000px]" : "max-h-0"} overflow-hidden`}>
                  <ul className="list-none border-t border-gray-200">
                    {chapter?.chapterContent?.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 border-b last:border-0">
                        <img src={assets.play_icon} className="w-4 h-4 mt-1" alt="" />
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between w-full text-sm">
                            <p className="font-medium">{lecture?.lectureTitle}</p>
                            <p className="text-gray-400">{lecture.lectureDuration}m</p>
                          </div>
                          <div className="flex gap-4 mt-1 text-xs">
                             <button onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className="text-blue-600 font-bold">Watch</button>
                             {lecture.resourceFile && <a href={lecture.resourceFile} target="_blank" className="text-green-600 font-bold">Resource</a>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 py-3 mt-10 border-t pt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={0} onRate={(r) => console.log(r)} />
          </div>
        </div>

     
        <div className="md:sticky md:top-10 h-fit">
          {playerData ? (
            <div className="bg-white rounded shadow-lg p-2">
              <YouTube 
                videoId={getYouTubeId(playerData.lectureUrl)} 
                opts={{ playerVars: { autoplay: 1 }}} 
                iframeClassName="w-full aspect-video" 
              />
              <div className="flex justify-between items-center mt-4 px-2">
                <p className="font-bold">{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                <button className="text-blue-600 font-medium">Mark Complete</button>
              </div>
            </div>
          ) : (
            <img src={courseData?.courseThumbnail} className="w-full rounded shadow" alt="" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;