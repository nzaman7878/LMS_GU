import React, { useEffect, useRef, useState, useCallback } from "react";


const uid = () => Math.random().toString(36).slice(2, 10);


const Icon = {
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="2" y="7" width="15" height="11" rx="2" />
      <path d="M17 9l5-2v10l-5-2" />
    </svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
};


const RichTextEditor = ({ value, onChange }) => {
  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
  };
  const editorRef = useRef(null);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {[
          { cmd: "bold", label: "B", style: "font-bold" },
          { cmd: "italic", label: "I", style: "italic" },
          { cmd: "underline", label: "U", style: "underline" },
        ].map(({ cmd, label, style }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
            className={`w-8 h-8 rounded-lg text-sm ${style} text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors`}
          >
            {label}
          </button>
        ))}
        <div className="w-px bg-slate-300 mx-1" />
        {[
          { cmd: "insertUnorderedList", label: "• List" },
          { cmd: "insertOrderedList", label: "1. List" },
        ].map(({ cmd, label }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
            className="px-2.5 h-8 rounded-lg text-xs text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[160px] px-4 py-3 text-sm text-slate-700 outline-none leading-relaxed"
        style={{ whiteSpace: "pre-wrap" }}
        data-placeholder="Write an engaging course description..."
      />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}`}</style>
    </div>
  );
};


const FileUploadZone = ({ accept, value, onChange, icon, label, color = "indigo" }) => {
  const colors = {
    indigo: "border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-600",
    emerald: "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-600",
    violet: "border-violet-200 bg-violet-50/60 hover:bg-violet-100/80 text-violet-600",
  };
  return (
    <label className={`group flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${colors[color]}`}>
      <div className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>
      <div className="text-center">
        <p className="text-xs font-semibold">{label}</p>
        {value
          ? <p className="text-[11px] mt-0.5 text-slate-500 truncate max-w-[140px]">{value.name}</p>
          : <p className="text-[11px] mt-0.5 opacity-60">Click to browse</p>
        }
      </div>
      <input type="file" accept={accept} hidden onChange={(e) => onChange(e.target.files[0] || null)} />
    </label>
  );
};


const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: "bg-emerald-600", error: "bg-rose-600", info: "bg-indigo-600" };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white text-sm font-medium shadow-2xl ${colors[type]} animate-[slideUp_0.3s_ease]`}>
      {message}
      <button onClick={onClose} className="opacity-70 hover:opacity-100"><Icon.X /></button>
    </div>
  );
};


export default function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [addingChapterTitle, setAddingChapterTitle] = useState("");
  const [isAddingChapter, setIsAddingChapter] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [toast, setToast] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    videoFile: null,
    resourceFile: null,
    isPreviewFree: false,
  });
  const [lectureErrors, setLectureErrors] = useState({});

  
  useEffect(() => {
    if (!image) { setImagePreview(null); return; }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

 
  const handleConfirmAddChapter = () => {
    const title = addingChapterTitle.trim();
    if (!title) return;
    setChapters((prev) => [
      ...prev,
      {
        chapterId: uid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder: prev.length + 1,
      },
    ]);
    setAddingChapterTitle("");
    setIsAddingChapter(false);
  };

  const handleChapterToggle = (id) =>
    setChapters((prev) =>
      prev.map((c) => (c.chapterId === id ? { ...c, collapsed: !c.collapsed } : c))
    );

  const handleChapterRemove = (id) =>
    setChapters((prev) => prev.filter((c) => c.chapterId !== id));

  
  const validateLecture = () => {
    const errs = {};
    if (!lectureDetails.lectureTitle.trim()) errs.title = "Title is required";
    if (!lectureDetails.lectureUrl.trim() && !lectureDetails.videoFile)
      errs.video = "Provide a video URL or upload a file";
    setLectureErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddLecture = () => {
    if (!validateLecture()) return;
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.chapterId === currentChapterId
          ? {
              ...chapter,
              chapterContent: [
                ...chapter.chapterContent,
                { ...lectureDetails, lectureId: uid() },
              ],
            }
          : chapter
      )
    );
    resetLecture();
    showToast("Lecture added successfully!", "success");
  };

  const resetLecture = () => {
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      videoFile: null,
      resourceFile: null,
      isPreviewFree: false,
    });
    setLectureErrors({});
    setShowPopup(false);
  };

  const handleDeleteLecture = (chapterId, idx) =>
    setChapters((prev) =>
      prev.map((c) =>
        c.chapterId === chapterId
          ? { ...c, chapterContent: c.chapterContent.filter((_, i) => i !== idx) }
          : c
      )
    );


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) { showToast("Course title is required.", "error"); return; }
    if (chapters.length === 0) { showToast("Add at least one chapter.", "error"); return; }
    const courseData = {
      courseTitle,
      description: courseDescription,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      image,
      chapters,
    };
    console.log("COURSE DATA →", courseData);
    showToast("Course published successfully! 🚀", "success");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3,.font-display { font-family: 'Sora', sans-serif; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-overlay { animation: fadeIn 0.2s ease; }
        .modal-card { animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .chapter-card { animation: slideUp 0.3s ease; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 py-10 px-4">
        <div className="max-w-3xl mx-auto">

     
          <div className="mb-8">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-2">
              <Icon.Book />
              <span>Course Builder</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-800 tracking-tight">Create a New Course</h1>
            <p className="text-slate-500 mt-1 text-sm">Fill in the details below to publish your course.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

       
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
              <h2 className="font-display text-base font-semibold text-slate-700 uppercase tracking-wider text-xs text-indigo-500">
                Basic Information
              </h2>

            
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Course Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Complete Web Development Bootcamp"
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                  required
                />
              </div>

              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Course Description</label>
                <RichTextEditor value={courseDescription} onChange={setCourseDescription} />
              </div>
            </section>

        
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
              <h2 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Pricing & Media</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5"><Icon.Tag />Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                    <input
                      type="number"
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(e.target.value)}
                      className="w-full border border-slate-200 pl-8 pr-4 py-2.5 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-600">Discount (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 pr-8 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                  </div>
                </div>
              </div>

    
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5"><Icon.Image />Course Thumbnail</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-600 cursor-pointer transition-all">
                    <Icon.Upload />
                    <div className="text-center">
                      <p className="text-xs font-semibold">{image ? image.name : "Upload Thumbnail"}</p>
                      <p className="text-[11px] opacity-60 mt-0.5">PNG, JPG, WEBP</p>
                    </div>
                    <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0] || null)} />
                  </label>
                  {imagePreview && (
                    <div className="relative w-28 h-20 flex-shrink-0">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm" />
                      <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white shadow">
                        <Icon.X />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Course Curriculum</h2>
                {!isAddingChapter && (
                  <button type="button" onClick={() => setIsAddingChapter(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    <Icon.Plus />Add Chapter
                  </button>
                )}
              </div>

              {isAddingChapter && (
                <div className="flex gap-2 items-center p-3 bg-indigo-50 rounded-xl border border-indigo-100 chapter-card">
                  <input
                    autoFocus
                    type="text"
                    value={addingChapterTitle}
                    onChange={(e) => setAddingChapterTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleConfirmAddChapter(); } if (e.key === "Escape") { setIsAddingChapter(false); setAddingChapterTitle(""); } }}
                    placeholder="Enter chapter name…"
                    className="flex-1 bg-white border border-indigo-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button type="button" onClick={handleConfirmAddChapter}
                    className="px-3.5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    Add
                  </button>
                  <button type="button" onClick={() => { setIsAddingChapter(false); setAddingChapterTitle(""); }}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Icon.X />
                  </button>
                </div>
              )}

           
              {chapters.length === 0 && !isAddingChapter && (
                <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
                  <Icon.Book />
                  <p className="text-sm">No chapters yet. Click <strong>Add Chapter</strong> to start.</p>
                </div>
              )}

           
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <div key={chapter.chapterId} className="border border-slate-100 rounded-xl overflow-hidden chapter-card">
                  
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-sm text-slate-700">{chapter.chapterTitle}</span>
                        <span className="text-xs text-slate-400">({chapter.chapterContent.length} lectures)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleChapterToggle(chapter.chapterId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          {chapter.collapsed ? <Icon.ChevronDown /> : <Icon.ChevronUp />}
                        </button>
                        <button type="button" onClick={() => handleChapterRemove(chapter.chapterId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                          <Icon.Trash />
                        </button>
                      </div>
                    </div>

                    {!chapter.collapsed && (
                      <div className="p-3 space-y-2 bg-white">
                        {chapter.chapterContent.map((lecture, i) => (
                          <div key={lecture.lectureId} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100 group">
                            <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">{lecture.lectureTitle}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {lecture.lectureDuration && (
                                  <span className="text-[11px] text-slate-400">{lecture.lectureDuration} min</span>
                                )}
                                {lecture.isPreviewFree && (
                                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                                    <Icon.Eye />Free Preview
                                  </span>
                                )}
                                {lecture.videoFile && (
                                  <span className="flex items-center gap-1 text-[11px] text-indigo-500"><Icon.Video />Video</span>
                                )}
                                {lecture.resourceFile && (
                                  <span className="flex items-center gap-1 text-[11px] text-violet-500"><Icon.File />Resource</span>
                                )}
                              </div>
                            </div>
                            <button type="button" onClick={() => handleDeleteLecture(chapter.chapterId, i)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                              <Icon.Trash />
                            </button>
                          </div>
                        ))}

                        <button type="button"
                          onClick={() => { setShowPopup(true); setCurrentChapterId(chapter.chapterId); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all">
                          <Icon.Plus />Add Lecture
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all text-sm tracking-wide hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              🚀 Publish Course
            </button>
          </form>
        </div>
      </div>

      
      {showPopup && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="modal-card bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto border border-slate-100">
           
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-800">Add Lecture</h2>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the lecture details below</p>
              </div>
              <button type="button" onClick={resetLecture}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <Icon.X />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
            
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Lecture Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className={`w-full border px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all ${lectureErrors.title ? "border-rose-400 focus:ring-2 focus:ring-rose-300" : "border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"}`}
                  placeholder="e.g. Introduction to React Hooks"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                />
                {lectureErrors.title && <p className="text-xs text-rose-500">{lectureErrors.title}</p>}
              </div>

             
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  placeholder="e.g. 12"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                />
              </div>

              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Video URL</label>
                <input
                  type="url"
                  className={`w-full border px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all placeholder-slate-400 ${lectureErrors.video ? "border-rose-400 focus:ring-2 focus:ring-rose-300" : "border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"}`}
                  placeholder="https://youtube.com/..."
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                />
              </div>

              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">or upload files</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              
              <div className="grid grid-cols-2 gap-3">
                <FileUploadZone
                  accept="video/*"
                  value={lectureDetails.videoFile}
                  onChange={(f) => setLectureDetails({ ...lectureDetails, videoFile: f })}
                  icon={<Icon.Video />}
                  label="Video File"
                  color="indigo"
                />
                <FileUploadZone
                  accept=".pdf,.zip,.rar,.doc,.docx,.txt,text/*"
                  value={lectureDetails.resourceFile}
                  onChange={(f) => setLectureDetails({ ...lectureDetails, resourceFile: f })}
                  icon={<Icon.File />}
                  label="Resource File"
                  color="emerald"
                />
              </div>
              {lectureErrors.video && <p className="text-xs text-rose-500 -mt-2">{lectureErrors.video}</p>}

              {/* Free preview toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 cursor-pointer group">
                <div className={`relative w-10 h-5.5 rounded-full transition-colors ${lectureDetails.isPreviewFree ? "bg-emerald-500" : "bg-slate-200"}`}
                  style={{ height: "22px" }}>
                  <div className={`absolute top-0.5 w-4.5 h-4 rounded-full bg-white shadow transition-transform ${lectureDetails.isPreviewFree ? "translate-x-5" : "translate-x-0.5"}`}
                    style={{ width: "18px", height: "18px", left: "2px" }} />
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Icon.Eye />Free Preview
                  </p>
                  <p className="text-[11px] text-slate-500">Students can watch without enrolling</p>
                </div>
              </label>

       
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddLecture}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm shadow-indigo-200 transition-all text-sm"
                >
                  Add Lecture
                </button>
                <button
                  type="button"
                  onClick={resetLecture}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}