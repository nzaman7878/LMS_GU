import express from "express";
import {
  createCourse,
  addLecture,
  addResource,
} from "../controllers/courseController.js";

import uploadVideo from "../middleware/multerVideo.js";
import uploadResource from "../middleware/multerResource.js";
import authEducator from "../middleware/authEducator.js";

const courseRouter = express.Router();



courseRouter.post(
  "/create",
  authEducator,
  createCourse
);



courseRouter.post(
  "/:courseId/chapter/:chapterId/lecture",
  authEducator,
  uploadVideo.single("video"),
  addLecture
);



courseRouter.post(
  "/:courseId/chapter/:chapterId/lecture/:lectureId/resource",
  authEducator,
  uploadResource.single("file"),
  addResource
);


export default courseRouter;