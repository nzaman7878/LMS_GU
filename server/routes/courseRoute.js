import express from "express";
import { createCourse } from "../controllers/courseController.js";
import authTeacher from "../middleware/authTeacher.js";

const courseRouter = express.Router();

courseRouter.post("/create", authTeacher, createCourse);

export default courseRouter;
