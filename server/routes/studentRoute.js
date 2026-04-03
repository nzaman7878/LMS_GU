import express from "express";
import {
  registerStudent,
  loginStudent,
  getStudentData,
  studentEnrolledCourses,
  purchaseCourse,
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

export default studentRouter;