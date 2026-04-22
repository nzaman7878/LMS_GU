import express from "express";
import upload from "../middleware/multer.js";
import {
  registerStudent,
  loginStudent,
  getStudentData,
  studentEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating ,
  updateStudentProfile ,
  enrollFreeCourse,
} from "../controllers/studentController.js";

import authStudent from "../middleware/authStudent.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);

studentRouter.get("/profile", authStudent, getStudentData);


studentRouter.get(
  "/enrolled-courses",
  authStudent,
  studentEnrolledCourses
);

studentRouter.post("/purchase", authStudent, purchaseCourse);
studentRouter.post("/update-course-progress", authStudent, updateUserCourseProgress);
studentRouter.post("/get-course-progress", authStudent, getUserCourseProgress);
studentRouter.post("/add-rating", authStudent, addUserRating);
studentRouter.put(
  "/update-profile", 
  authStudent, 
  upload.single('image'), 
  updateStudentProfile
);
studentRouter.post("/enroll-free", authStudent, enrollFreeCourse);

export default studentRouter;