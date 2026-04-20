import courseModel from "../models/courseModel.js";
import educatorModel from "../models/educatorModel.js";
import cloudinary from "../config/cloudinary.js";




export const createCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const educatorId = req.educatorId; 
    const files = req.files || [];

   
    console.log("Educator ID:", educatorId);

    const getFile = (fieldname) =>
      files.find((f) => f.fieldname === fieldname);

    const thumbnailFile = getFile("thumbnail");

    if (!thumbnailFile) {
      return res.json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    const educator = await educatorModel.findById(educatorId);

    if (!educator) {
      return res.json({
        success: false,
        message: "Educator not found",
      });
    }

    let parsedData = JSON.parse(courseData);

   
    parsedData.educator = educatorId;
    parsedData.discount = parsedData.discount || 0;

    if (!parsedData.courseContent || parsedData.courseContent.length === 0) {
      throw new Error("Course content is required");
    }

    
    const thumbnailUpload = await cloudinary.uploader.upload(
      thumbnailFile.path
    );

    parsedData.courseThumbnail = thumbnailUpload.secure_url;
    parsedData.thumbnailPublicId = thumbnailUpload.public_id;

    parsedData.courseContent = await Promise.all(
      parsedData.courseContent.map(async (chapter, cIdx) => {
        chapter.chapterId = chapter.chapterId || `chap_${Date.now()}_${cIdx}`;
        chapter.chapterOrder = chapter.chapterOrder || cIdx + 1;

        chapter.chapterContent = await Promise.all(
          chapter.chapterContent.map(async (lecture, lIdx) => {
            lecture.lectureId =
              lecture.lectureId || `lec_${Date.now()}_${lIdx}`;
            lecture.lectureOrder = lecture.lectureOrder || lIdx + 1;
            lecture.isPreviewFree = lecture.isPreviewFree ?? false;
            lecture.lectureDuration =
              Number(lecture.lectureDuration) || 0;

            if (lecture.videoType === "youtube" && !lecture.youtubeUrl) {
              throw new Error(
                `YouTube URL required for: ${lecture.lectureTitle}`
              );
            }

            if (lecture.videoType === "upload") {
              const videoFile = getFile(lecture.videoFileName);
              if (!videoFile)
                throw new Error(
                  `Video missing for: ${lecture.lectureTitle}`
                );

              const videoUpload = await cloudinary.uploader.upload(
                videoFile.path,
                { resource_type: "video" }
              );

              lecture.videoUrl = videoUpload.secure_url;
              lecture.videoPublicId = videoUpload.public_id;
            }

            if (lecture.resources?.length > 0) {
              for (let resource of lecture.resources) {
                const resourceFile = getFile(resource.fileName);
                if (!resourceFile)
                  throw new Error(
                    `Resource file missing for: ${resource.title}`
                  );

                const upload = await cloudinary.uploader.upload(
                  resourceFile.path,
                  { resource_type: "raw" }
                );

                resource.fileUrl = upload.secure_url;
                resource.public_id = upload.public_id;
              }
            }

            return lecture;
          })
        );

        return chapter;
      })
    );

    const newCourse = await courseModel.create(parsedData);

   
    await educatorModel.findByIdAndUpdate(educatorId, {
      $push: { courses: newCourse._id },
    });

    res.json({
      success: true,
      message: "Course Created Successfully",
      course: newCourse,
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


export const addLecture = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { lectureTitle, lectureDuration, videoType, youtubeUrl } = req.body;

    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    const chapter = course.courseContent.find((c) => c.chapterId === chapterId);
    if (!chapter) throw new Error("Chapter not found");

    let videoUrl = "";
    let videoPublicId = "";

    if (videoType === "youtube") {
      if (!youtubeUrl) throw new Error("YouTube URL required");
      videoUrl = youtubeUrl;
    } else {
      const videoFile = req.file; 
      if (!videoFile) throw new Error("Video file required");

      const upload = await cloudinary.uploader.upload(videoFile.path, {
        resource_type: "video",
      });

      videoUrl = upload.secure_url;
      videoPublicId = upload.public_id;
    }

    const newLecture = {
      lectureId: Date.now().toString(),
      lectureTitle,
      lectureDuration: Number(lectureDuration),
      videoType,
      youtubeUrl: videoType === "youtube" ? youtubeUrl : "",
      videoUrl,
      videoPublicId,
      isPreviewFree: false,
      lectureOrder: chapter.chapterContent.length + 1,
      resources: [],
    };

    chapter.chapterContent.push(newLecture);
    await course.save();

    res.json({
      success: true,
      message: "Lecture added successfully",
      lecture: newLecture,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const addResource = async (req, res) => {
  try {
    const { courseId, chapterId, lectureId } = req.params;
    const { title } = req.body;

    const file = req.file;
    if (!file) throw new Error("File required");

    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    const chapter = course.courseContent.find((c) => c.chapterId === chapterId);
    if (!chapter) throw new Error("Chapter not found");

    const lecture = chapter.chapterContent.find((l) => l.lectureId === lectureId);
    if (!lecture) throw new Error("Lecture not found");

    const upload = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
    });

    const newResource = {
      title,
      fileUrl: upload.secure_url,
      public_id: upload.public_id,
    };

    lecture.resources.push(newResource);
    await course.save();

    res.json({
      success: true,
      message: "Resource added successfully",
      resource: newResource,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllCourse = async (req, res) => {
  try {
    const courses = await courseModel.find({ isPublished: true })
      .select(['-courseContent', '-enrolledStudents'])
      .populate({ path: 'educator' });

    res.json({ success: true, courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await courseModel.findById(id)
      .populate({ path: 'educator' });

    if (!courseData) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }

  
    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.videoUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addQuiz = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { quizTitle, questions } = req.body;


    if (!quizTitle || !questions || questions.length === 0) {
      return res.json({
        success: false,
        message: "Quiz title and questions are required",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    const chapter = course.courseContent.find(
      (c) => c.chapterId === chapterId
    );
    if (!chapter) throw new Error("Chapter not found");

    if (!chapter.quizzes) {
      chapter.quizzes = [];
    }

    
    for (let q of questions) {
      if (
        !q.question ||
        !q.options ||
        q.options.length < 4 ||
        q.correctAnswer === undefined
      ) {
        throw new Error("Invalid question format");
      }
    }

    const newQuiz = {
      quizId: Date.now().toString(),
      quizTitle,
      questions,
    };

    chapter.quizzes.push(newQuiz);

    await course.save();

    res.json({
      success: true,
      message: "Quiz added successfully",
      quiz: newQuiz,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};