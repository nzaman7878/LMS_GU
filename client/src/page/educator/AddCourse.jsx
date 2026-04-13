import React, { useEffect, useRef, useState ,useContext, } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AddCourse = () => {
const { backendUrl, isEducator } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    videoFile: null,
    resourceFile: null, 
    isPreviewFree: false,
  });

  
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write course description here...",
      });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0
              ? chapters.slice(-1)[0].chapterOrder + 1
              : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  
  const handleAddLecture = () => {
    if (!lectureDetails.lectureTitle || (!lectureDetails.lectureUrl && !lectureDetails.videoFile)) {
      alert("Please provide a title and either a video URL or a video file.");
      return;
    }

    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, { ...lectureDetails, lectureId: uniqid() }],
          };
        }
        return chapter;
      })
    );

   
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      videoFile: null,
      resourceFile: null,
      isPreviewFree: false,
    });
    setShowPopup(false);
  };

  const handleDeleteLecture = (chapterId, lectureIndex) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          const updated = [...chapter.chapterContent];
          updated.splice(lectureIndex, 1);
          return { ...chapter, chapterContent: updated };
        }
        return chapter;
      })
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (!image) return toast.error("Thumbnail Not Selected");
    if (chapters.length === 0) return toast.error("Add at least one chapter");

    const token = localStorage.getItem("educatorToken");
    if (!token) return toast.error("User not authenticated. Please login again.");

    const formData = new FormData();

    const courseData = {
      courseTitle,
      courseDescription: quillRef.current?.root?.innerHTML || "",
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters.map((chapter) => ({
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        chapterOrder: chapter.chapterOrder,
        chapterContent: chapter.chapterContent.map((lecture) => {
          const videoType = lecture.videoFile ? "upload" : "youtube";

          return {
            lectureId: lecture.lectureId,
            lectureTitle: lecture.lectureTitle,
            lectureDuration: lecture.lectureDuration,
            isPreviewFree: lecture.isPreviewFree,
            videoType,
           
            youtubeUrl: videoType === "youtube" ? lecture.lectureUrl : "",
            videoFileName: videoType === "upload" ? `video_${lecture.lectureId}` : null,
            resources: lecture.resourceFile
              ? [{ title: "Resource File", fileName: `resource_${lecture.lectureId}` }]
              : [],
          };
         
        }),
      })),
    };

    formData.append("courseData", JSON.stringify(courseData));
    formData.append("thumbnail", image);

    chapters.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (lecture.videoFile) {
          formData.append(`video_${lecture.lectureId}`, lecture.videoFile);
        }
        if (lecture.resourceFile) {
          formData.append(`resource_${lecture.lectureId}`, lecture.resourceFile);
        }
      });
    });

    const loadingToast = toast.loading("Uploading content to Cloudinary...");

    const { data } = await axios.post(
      `${backendUrl}/api/course/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
       
        },
      }
    );

    toast.dismiss(loadingToast);

    if (data.success) {
      toast.success(data.message);
      setCourseTitle("");
      setCoursePrice(0);
      setDiscount(0);
      setChapters([]);
      setImage(null);
      if (quillRef.current) quillRef.current.root.innerHTML = "";
    } else {
      toast.error(data.message); 
    }
  } catch (error) {
    toast.dismiss();
    console.error("Submit error:", error); 
    toast.error(error.response?.data?.message || error.message);
  }
};

if (isEducator) {
  return (
    <div className="h-screen overflow-y-auto flex flex-col items-start md:p-8 p-4 bg-gray-50 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 max-w-3xl w-full bg-white p-6 rounded-lg shadow-sm border text-gray-700"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Add New Course</h2>

    
        <div className="flex flex-col gap-2">
          <label className="font-medium">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g. Complete Web Development"
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Course Description</label>
          <div className="bg-white">
             <div ref={editorRef} className="min-h-[200px]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Price ($)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md"
              min="0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Course Thumbnail</label>
            <div className="flex items-center gap-3">
               <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md border border-blue-200 hover:bg-blue-100 transition">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
               </label>
               {image && <span className="text-xs text-gray-500 truncate max-w-[150px]">{image.name}</span>}
            </div>
          </div>
        </div>

    
        <div className="flex flex-col gap-2 w-1/2">
          <label className="font-medium">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md"
            min="0"
            max="100"
          />
        </div>

        <hr className="my-2" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Course Curriculum</h3>
            <button
              type="button"
              onClick={() => handleChapter("add")}
              className="text-blue-600 font-semibold hover:underline"
            >
              + Add Chapter
            </button>
          </div>

          {chapters.map((chapter, index) => (
            <div key={chapter.chapterId} className="border rounded-lg bg-gray-50 overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
                <span className="font-semibold text-gray-800">
                  Chapter {index + 1}: {chapter.chapterTitle}
                </span>
                <div className="flex gap-4 text-sm">
                  <button type="button" onClick={() => handleChapter("toggle", chapter.chapterId)}>
                    {chapter.collapsed ? "Expand" : "Collapse"}
                  </button>
                  <button type="button" onClick={() => handleChapter("remove", chapter.chapterId)} className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="p-4 space-y-3">
                  {chapter.chapterContent.map((lecture, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded border">
                      <div className="flex flex-col">
                         <span className="font-medium text-sm">{i + 1}. {lecture.lectureTitle}</span>
                         <span className="text-xs text-gray-400">
                           {lecture.lectureDuration} mins • {lecture.isPreviewFree ? "Free" : "Paid"}
                           {lecture.videoFile ? " • (Video Attached)" : ""}
                           {lecture.resourceFile ? " • (Resource Attached)" : ""}
                         </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteLecture(chapter.chapterId, i)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setShowPopup(true);
                      setCurrentChapterId(chapter.chapterId);
                    }}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition"
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-all mt-4">
          PUBLISH COURSE
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Lecture Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1 text-gray-700">Lecture Title</p>
                <input
                  type="text"
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-1 text-gray-700">Duration (minutes)</p>
                <input
                  type="number"
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-1 text-gray-700">Video URL</p>
                <input
                  type="text"
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Paste URL here..."
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                />
              </div>

              
              <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                <p className="text-xs font-bold mb-2 text-gray-400 text-center uppercase tracking-wider">OR Video File</p>
                <input
                  type="file"
                  accept="video/*"
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                  onChange={(e) => setLectureDetails({ ...lectureDetails, videoFile: e.target.files[0] })}
                />
                {lectureDetails.videoFile && (
                  <p className="text-[10px] text-blue-600 mt-1 italic truncate font-medium">Video: {lectureDetails.videoFile.name}</p>
                )}
              </div>

             
              <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                <p className="text-xs font-bold mb-2 text-gray-700">Additional Resources (PDF, Code, etc.)</p>
                <input
                  type="file"
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700"
                  onChange={(e) => setLectureDetails({ ...lectureDetails, resourceFile: e.target.files[0] })}
                />
                {lectureDetails.resourceFile && (
                  <p className="text-[10px] text-green-600 mt-1 italic truncate font-medium">Resource: {lectureDetails.resourceFile.name}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="preview"
                  className="cursor-pointer"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                />
                <label htmlFor="preview" className="text-sm cursor-pointer select-none text-gray-600 font-medium">Make this a free preview</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleAddLecture}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-bold shadow-sm"
                >
                  Add Lecture
                </button>
                <button 
                  onClick={() => {
                    setShowPopup(false);
                    setLectureDetails({ lectureTitle: "", lectureDuration: "", lectureUrl: "", videoFile: null, resourceFile: null, isPreviewFree: false });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
};

export default AddCourse;