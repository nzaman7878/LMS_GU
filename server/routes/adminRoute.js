import express from "express";
import { loginAdmin , addTeacher } from "../controllers/adminController.js";
import upload from '../middleware/multer.js'
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router()


adminRouter.post("/login", loginAdmin);

adminRouter.post("/add-teacher",authAdmin, upload.single('image'), addTeacher);


export default adminRouter;
