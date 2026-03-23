import express from "express";
import { educatorLogin, getEducatorCourses } from "../controllers/educatorController.js";
import authEducator from "../middleware/authEducator.js";


const educatorRouter = express.Router();


educatorRouter.post("/login", educatorLogin);



educatorRouter.get("/courses", authEducator, getEducatorCourses);

export default educatorRouter;