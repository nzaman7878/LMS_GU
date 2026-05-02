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
  submitQuizScore,
  getStudentInterviews,
  submitInterviewAttempt,
  getMyInterviewAttempts,
  getLectureDoubts, askDoubt, replyToDoubt,
  deleteStudentDoubt, editStudentDoubt, deleteStudentReply, editStudentReply

} from "../controllers/studentController.js";
import { askChatbot } from "../controllers/chatController.js";

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
studentRouter.post("/submit-quiz", authStudent, submitQuizScore);


studentRouter.get("/interviews", authStudent, getStudentInterviews);


studentRouter.post("/interviews/attempt", authStudent, submitInterviewAttempt);
studentRouter.get("/interviews/my-attempts", authStudent, getMyInterviewAttempts);
studentRouter.get("/doubts/:courseId/:lectureId", getLectureDoubts); 
studentRouter.post("/doubts/ask", authStudent, askDoubt);
studentRouter.post("/doubts/:doubtId/reply", replyToDoubt); 
studentRouter.delete("/doubts/:doubtId", authStudent, deleteStudentDoubt);
studentRouter.put("/doubts/:doubtId", authStudent, editStudentDoubt);
studentRouter.delete("/doubts/:doubtId/reply/:replyId", authStudent, deleteStudentReply);
studentRouter.put("/doubts/:doubtId/reply/:replyId", authStudent, editStudentReply);
studentRouter.post("/chatbot/ask", authStudent, askChatbot);

export default studentRouter;