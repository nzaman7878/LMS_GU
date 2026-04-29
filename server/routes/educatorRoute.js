import express from "express";
import { educatorLogin, getEducatorProfile,   
  updateEducatorProfile, getEducatorCourses , educatorDashboardData , getEnrolledStudentsData } from "../controllers/educatorController.js";
import upload from '../middleware/multer.js';
import authEducator from "../middleware/authEducator.js";


const educatorRouter = express.Router();


educatorRouter.post("/login", educatorLogin);


educatorRouter.get("/profile", authEducator, getEducatorProfile);


educatorRouter.post("/update-profile", authEducator, upload.single('image'), updateEducatorProfile);

educatorRouter.get("/courses", authEducator, getEducatorCourses);

educatorRouter.get("/dashboard", authEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", authEducator, getEnrolledStudentsData);

export default educatorRouter;