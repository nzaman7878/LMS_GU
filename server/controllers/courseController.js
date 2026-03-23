import courseModel from "../models/courseModel.js";
import educatorModel from "../models/educatorModel.js";
import cloudinary from "../config/cloudinary.js";



export const createCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const educatorId = req.educatorId;
    const files = req.files;

    if (!files || !files.thumbnail) {
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

    const parsedData = JSON.parse(courseData);
    parsedData.educator = educatorId;

    if (!parsedData.courseContent) {
      throw new Error("Course content is required");
    }

    const thumbnailUpload = await cloudinary.uploader.upload(
      files.thumbnail[0].path
    );

    parsedData.courseThumbnail = thumbnailUpload.secure_url;
    parsedData.thumbnailPublicId = thumbnailUpload.public_id;

   
    for (let chapter of parsedData.courseContent) {
      for (let lecture of chapter.chapterContent) {

       
        if (lecture.videoType === "youtube" && !lecture.youtubeUrl) {
          throw new Error(`YouTube URL required for ${lecture.lectureTitle}`);
        }

        if (lecture.videoType === "upload") {
          const videoFile = files[lecture.videoFileName]?.[0];

          if (!videoFile) {
            throw new Error(`Video missing for ${lecture.lectureTitle}`);
          }

          const videoUpload = await cloudinary.uploader.upload(
            videoFile.path,
            { resource_type: "video" }
          );

          lecture.videoUrl = videoUpload.secure_url;
          lecture.videoPublicId = videoUpload.public_id;
        }

    
        if (lecture.resources?.length > 0) {
          for (let resource of lecture.resources) {
            const pdfFile = files[resource.fileName]?.[0];

            if (!pdfFile) {
              throw new Error(`PDF missing: ${resource.title}`);
            }

            const pdfUpload = await cloudinary.uploader.upload(
              pdfFile.path,
              { resource_type: "raw" }
            );

            resource.fileUrl = pdfUpload.secure_url;
            resource.public_id = pdfUpload.public_id;
          }
        }
      }
    }

    const newCourse = await courseModel.create(parsedData);

    res.json({
      success: true,
      message: "Course Created Successfully",
      course: newCourse,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addLecture = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { lectureTitle, lectureDuration, videoType, youtubeUrl } = req.body;

    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    const chapter = course.courseContent.find(
      (c) => c.chapterId === chapterId
    );

    if (!chapter) throw new Error("Chapter not found");

    let videoUrl = "";
    let videoPublicId = "";

    // 🎥 Handle video
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
      lectureDuration,
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
    res.json({
      success: false,
      message: error.message,
    });
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

    const chapter = course.courseContent.find(
      (c) => c.chapterId === chapterId
    );
    if (!chapter) throw new Error("Chapter not found");

    const lecture = chapter.chapterContent.find(
      (l) => l.lectureId === lectureId
    );
    if (!lecture) throw new Error("Lecture not found");

    // 📄 Upload PDF
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
    res.json({
      success: false,
      message: error.message,
    });
  }
};