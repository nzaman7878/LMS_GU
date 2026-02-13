import express from "express";
import { teacherLogin } from "../controllers/teacherController.js";

const teacherRouter = express.Router() 

teacherRouter.get("/login", teacherLogin);

export default teacherRouter;