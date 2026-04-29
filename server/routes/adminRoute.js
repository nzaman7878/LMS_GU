import express from "express";
import { registerAdmin, loginAdmin , addEducator , getAllEducators , deleteEducator , updateEducator , getAllStudents , updateStudent, deleteStudent , getAllCoursesAdmin,deleteCourseAdmin , getDashboardStats} from "../controllers/adminController.js";
import upload from '../middleware/multer.js'
import authAdmin from "../middleware/authAdmin.js";
import { updateCourse } from "../controllers/courseController.js";

const adminRouter = express.Router()

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter.post("/addEducator",authAdmin, upload.single('image'), addEducator);
adminRouter.get('/all-educators', authAdmin, getAllEducators);
adminRouter.post('/delete-educator', authAdmin, deleteEducator);
adminRouter.post('/update-educator', authAdmin, upload.single('image'), updateEducator);
adminRouter.get("/all-students", authAdmin, getAllStudents);
adminRouter.post("/update-student", authAdmin, updateStudent);
adminRouter.post("/delete-student", authAdmin, deleteStudent);
adminRouter.get('/courses',authAdmin, getAllCoursesAdmin)
adminRouter.delete('/course/:courseId',authAdmin, deleteCourseAdmin);
adminRouter.put("/course/update/:courseId", authAdmin,upload.any(), updateCourse);
adminRouter.get("/dashboard-stats", authAdmin, getDashboardStats);

export default adminRouter;
