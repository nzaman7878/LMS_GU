import express from "express";
import { teacherLogin  } from "../controllers/teacherController.js";

const teacherRouter = express.Router() 

teacherRouter.post("/login", teacherLogin);


export default teacherRouter;