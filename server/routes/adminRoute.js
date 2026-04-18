import express from "express";
import { registerAdmin, loginAdmin , addEducator , getAllEducators , deleteEducator , updateEducator } from "../controllers/adminController.js";
import upload from '../middleware/multer.js'
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router()

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter.post("/addEducator",authAdmin, upload.single('image'), addEducator);
adminRouter.get('/all-educators', authAdmin, getAllEducators);
adminRouter.post('/delete-educator', authAdmin, deleteEducator);
adminRouter.post('/update-educator', authAdmin, upload.single('image'), updateEducator);


export default adminRouter;
