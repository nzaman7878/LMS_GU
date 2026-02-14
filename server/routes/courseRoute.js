import express from "express";
import { createCourse ,addLecture } from "../controllers/courseController.js";
import uploadVideo from "../middleware/multerVideo.js";
import authTeacher from "../middleware/authTeacher.js";


const courseRouter = express.Router();

courseRouter.post("/create", authTeacher, createCourse);
courseRouter.post(
  "/:courseId/module/:moduleId/lecture",
  authTeacher,
  uploadVideo.single("video"),
  addLecture
);

export default courseRouter;
