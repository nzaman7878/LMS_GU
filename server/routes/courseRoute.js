import express from "express";
import { createCourse ,addLecture , addResource } from "../controllers/courseController.js";
import uploadVideo from "../middleware/multerVideo.js";
import uploadResource from "../middleware/multerResource.js";
import authTeacher from "../middleware/authTeacher.js";


const courseRouter = express.Router();

courseRouter.post(
    "/create",
     authTeacher,
      createCourse);

courseRouter.post(
  "/:courseId/module/:moduleId/lecture",
  authTeacher,
  uploadVideo.single("video"),
  addLecture
);

courseRouter.post(
  "/:courseId/module/:moduleId/resource",
  authTeacher,
  uploadResource.single("file"),
  addResource
);


export default courseRouter;
