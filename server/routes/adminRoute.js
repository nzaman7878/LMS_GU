import express from "express";
import { loginAdmin , addEducator } from "../controllers/adminController.js";
import upload from '../middleware/multer.js'
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router()


adminRouter.post("/login", loginAdmin);

adminRouter.post("/addEducator",authAdmin, upload.single('image'), addEducator);


export default adminRouter;
