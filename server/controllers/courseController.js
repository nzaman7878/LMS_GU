import courseModel from "../models/courseModel.js";
import educatorModel from "../models/educatorModel.js";
import cloudinary from "../config/cloudinary.js";
import Coupon from "../models/couponModel.js";



export const createCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const educatorId = req.educatorId;
    const files = req.files || [];

    const parsedData = JSON.parse(courseData);

    const getFile = (name) => files.find((f) => f.fieldname === name);

    // ✅ Educator check
    const educator = await educatorModel.findById(educatorId);
    if (!educator) throw new Error("Educator not found");

    parsedData.educator = educatorId;
    parsedData.discount = parsedData.discount || 0;

    // ✅ Thumbnail upload
    const thumbnailFile = getFile("thumbnail");
    if (!thumbnailFile) throw new Error("Thumbnail required");

    const thumb = await cloudinary.uploader.upload(thumbnailFile.path);
    parsedData.courseThumbnail = thumb.secure_url;
    parsedData.thumbnailPublicId = thumb.public_id;

    // ✅ FIX: Ensure structure + ordering
    parsedData.courseContent = parsedData.courseContent.map((chapter, cIdx) => {

      chapter.chapterId = chapter.chapterId || `chap_${Date.now()}_${cIdx}`;
      chapter.chapterOrder = cIdx + 1;

      chapter.chapterContent = chapter.chapterContent.map((lecture, lIdx) => {

        lecture.lectureId = lecture.lectureId || `lec_${Date.now()}_${lIdx}`;
        lecture.lectureOrder = lIdx + 1;

        lecture.isPreviewFree = lecture.isPreviewFree ?? false;
        lecture.lectureDuration = Number(lecture.lectureDuration) || 0;

        return lecture;
      });

      return chapter;
    });

    const newCourse = await courseModel.create(parsedData);

    await educatorModel.findByIdAndUpdate(educatorId, {
      $push: { courses: newCourse._id },
    });

    res.json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });

  } catch (error) {
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
      resource_type: "auto", 
    });

   
    const newResource = {
      title,
      fileUrl: upload.secure_url, 
      public_id: upload.public_id,
    };

    lecture.resources.push(newResource);

    course.markModified('courseContent');


    await course.save();

    res.json({
      success: true,
      message: "Resource added successfully",
      resource: newResource,
    });

  } catch (error) {
    console.error("Upload Error:", error);
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


export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate, courseId } = req.body;
    const educatorId = req.educatorId;

    const newCoupon = await Coupon.create({
      code,
      discountPercentage: Number(discountPercentage),
      expiryDate,
      courseId: courseId || null,
      educatorId,
    });

    res.json({ 
      success: true, 
      message: "Coupon created successfully", 
      coupon: newCoupon 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, courseId } = req.body;

   
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid or inactive coupon code." });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.json({ success: false, message: "This coupon has expired." });
    }


    if (coupon.courseId && coupon.courseId.toString() !== courseId) {
      return res.json({ success: false, message: "Coupon is not valid for this specific course." });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found." });
    }

    const baseDiscountAmount = (course.coursePrice * course.discount) / 100;
    const priceAfterBaseDiscount = course.coursePrice - baseDiscountAmount;

    const couponDiscountAmount = (priceAfterBaseDiscount * coupon.discountPercentage) / 100;
    const finalPrice = priceAfterBaseDiscount - couponDiscountAmount;

    res.json({
      success: true,
      message: "Coupon applied successfully!",
      couponDetails: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        originalPrice: course.coursePrice,
        finalPrice: Math.max(0, finalPrice), 
        isFree: finalPrice <= 0 
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.educatorId;
    const { courseData } = req.body;
    const files = req.files || [];

    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    if (course.educator.toString() !== educatorId.toString()) {
      throw new Error("Unauthorized");
    }

    const parsedData = courseData ? JSON.parse(courseData) : {};

    
    const getFile = (name) => files.find((f) => f.fieldname === name);

    
    const thumbnailFile = getFile("thumbnail");
    if (thumbnailFile) {
      if (course.thumbnailPublicId) {
        await cloudinary.uploader.destroy(course.thumbnailPublicId);
      }
      const upload = await cloudinary.uploader.upload(thumbnailFile.path);
      parsedData.courseThumbnail = upload.secure_url;
      parsedData.thumbnailPublicId = upload.public_id;
    }

    
    if (parsedData.courseContent?.length > 0) {
      
      for (const [cIdx, chapter] of parsedData.courseContent.entries()) {
        chapter.chapterId = chapter.chapterId || `chap_${Date.now()}_${cIdx}`;
        chapter.chapterOrder = cIdx + 1;

        if (chapter.chapterContent?.length > 0) {
          for (const [lIdx, lecture] of chapter.chapterContent.entries()) {
            lecture.lectureOrder = lIdx + 1;
            lecture.lectureId = lecture.lectureId || `lec_${Date.now()}_${lIdx}`;
            lecture.isPreviewFree = String(lecture.isPreviewFree) === 'true';
            lecture.lectureDuration = Number(lecture.lectureDuration) || 0;

           
            const videoFile = getFile(`video_${lecture.lectureId}`);
            if (videoFile) {
              
              const upload = await cloudinary.uploader.upload(videoFile.path, { resource_type: "video" });
              lecture.videoUrl = upload.secure_url;
              lecture.videoPublicId = upload.public_id;
              lecture.videoType = "upload";
            }

const resourceFile = getFile(`resource_${lecture.lectureId}`);

if (resourceFile) {
  const upload = await cloudinary.uploader.upload(resourceFile.path, { 
    resource_type: "auto", 
    access_mode: "public", 
    folder: "course_resources",
   
    flags: "attachment" 
  });

  lecture.resources = [{
    title: resourceFile.originalname || "Resource File",
    fileUrl: upload.secure_url, 
    public_id: upload.public_id
  }];
}  }
        }
      }
    }

   
    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      { $set: parsedData },
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {
    console.error("Update Course Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.educatorId;

   
    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    if (course.educator.toString() !== educatorId.toString()) {
      throw new Error("Unauthorized: You can only delete your own courses");
    }

    
    if (course.thumbnailPublicId) {
      await cloudinary.uploader.destroy(course.thumbnailPublicId);
    }


    if (course.courseContent && course.courseContent.length > 0) {
      for (const chapter of course.courseContent) {
        for (const lecture of chapter.chapterContent) {
   
          if (lecture.videoType === "upload" && lecture.videoPublicId) {
            await cloudinary.uploader.destroy(lecture.videoPublicId, { resource_type: "video" });
          }
     
          if (lecture.resources && lecture.resources.length > 0) {
            for (const resource of lecture.resources) {
              if (resource.public_id) {
                await cloudinary.uploader.destroy(resource.public_id, { resource_type: "raw" });
              }
            }
          }
        }
      }
    }


    await courseModel.findByIdAndDelete(courseId);

    await educatorModel.findByIdAndUpdate(educatorId, {
      $pull: { courses: courseId },
    });

   
    await Coupon.deleteMany({ courseId: courseId });

    res.json({
      success: true,
      message: "Course and associated media deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};