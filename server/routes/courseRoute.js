import express from "express";
import {
  createCourse,
  addLecture,
  addResource,
  getAllCourse,
  getCourseId,
  addQuiz,
  createCoupon,
  validateCoupon,
  updateCourse, 
  deleteCourse   
} from "../controllers/courseController.js";

import uploadVideo from "../middleware/multerVideo.js";
import uploadResource from "../middleware/multerResource.js";
import authEducator from "../middleware/authEducator.js";

const courseRouter = express.Router();

// Create Course
courseRouter.post(
  "/create",
  authEducator,
  uploadVideo.any(), 
  createCourse
);

// Update Course
courseRouter.put(
  "/update/:courseId",
  authEducator,
  uploadVideo.any(), 
  updateCourse
);

// Delete Course
courseRouter.delete(
  "/delete/:courseId",
  authEducator,
  deleteCourse
);

// Add Lecture
courseRouter.post(
  "/:courseId/chapter/:chapterId/lecture",
  authEducator,
  uploadVideo.single("video"),
  addLecture
);

// Add Resource
courseRouter.post(
  "/:courseId/chapter/:chapterId/lecture/:lectureId/resource",
  authEducator,
  uploadResource.single("file"),
  addResource
);

// Get Courses
courseRouter.get('/all', getAllCourse);
courseRouter.get('/:id', getCourseId);

// Add Quiz
courseRouter.post(
  "/:courseId/chapter/:chapterId/quiz",
  authEducator,
  addQuiz
);

// Coupons
courseRouter.post(
  "/create-coupon",
  authEducator,
  createCoupon
);

courseRouter.post(
  "/validate-coupon",
  validateCoupon
);

export default courseRouter;