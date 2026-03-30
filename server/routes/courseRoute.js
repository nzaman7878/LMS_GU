import express from "express";
import {
  createCourse,
  addLecture,
  addResource,
  getAllCourse,
  getCourseId

} from "../controllers/courseController.js";

import uploadVideo from "../middleware/multerVideo.js";
import uploadResource from "../middleware/multerResource.js";
import authEducator from "../middleware/authEducator.js";

const courseRouter = express.Router();


courseRouter.post(
  "/create",
  authEducator,
  uploadVideo.any(), 
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

courseRouter.get('/all', getAllCourse);
courseRouter.get('/:id', getCourseId);

export default courseRouter;