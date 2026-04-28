import express from "express";
import { educatorLogin, getEducatorProfile,   // <--- Added
  updateEducatorProfile, getEducatorCourses , educatorDashboardData , getEnrolledStudentsData } from "../controllers/educatorController.js";
import authEducator from "../middleware/authEducator.js";


const educatorRouter = express.Router();


educatorRouter.post("/login", educatorLogin);


educatorRouter.get("/profile", authEducator, getEducatorProfile);


educatorRouter.post("/update-profile", authEducator, updateEducatorProfile);

educatorRouter.get("/courses", authEducator, getEducatorCourses);

educatorRouter.get("/dashboard", authEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", authEducator, getEnrolledStudentsData);

export default educatorRouter;