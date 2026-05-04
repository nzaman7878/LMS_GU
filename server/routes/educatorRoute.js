import express from "express";
import { 
  educatorLogin, 
  getEducatorProfile,   
  updateEducatorProfile, 
  getEducatorCourses, 
  educatorDashboardData, 
  getEnrolledStudentsData,
  createInterviewQuestion,
  getEducatorInterviewQuestions,
  getInterviewSubmissions,
  reviewInterviewSubmission,
  updateInterviewQuestion,
  deleteInterviewQuestion,
  getEducatorDoubts,
  replyToStudentDoubt,
  deleteDoubt,
  editDoubtReply,
  deleteDoubtReply,
    createAssignment, 
  getSubmissionsForAssignment, 
  gradeSubmission ,
  getEducatorAssignments
} from "../controllers/educatorController.js";



import upload from '../middleware/multer.js';
import authEducator from "../middleware/authEducator.js";

const educatorRouter = express.Router();

educatorRouter.post("/login", educatorLogin);
educatorRouter.get("/profile", authEducator, getEducatorProfile);
educatorRouter.post("/update-profile", authEducator, upload.single('image'), updateEducatorProfile);
educatorRouter.get("/courses", authEducator, getEducatorCourses);
educatorRouter.get("/dashboard", authEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", authEducator, getEnrolledStudentsData);


educatorRouter.post("/interviews/create", authEducator, createInterviewQuestion);
educatorRouter.get("/interviews", authEducator, getEducatorInterviewQuestions);
educatorRouter.get("/interviews/submissions", authEducator, getInterviewSubmissions);
educatorRouter.put("/interviews/submissions/:attemptId/review", authEducator, reviewInterviewSubmission);
educatorRouter.put("/interviews/:questionId", authEducator, updateInterviewQuestion);
educatorRouter.delete("/interviews/:questionId", authEducator, deleteInterviewQuestion);


educatorRouter.get("/doubts", authEducator, getEducatorDoubts);
educatorRouter.post("/doubts/:doubtId/reply", authEducator, replyToStudentDoubt);
educatorRouter.delete("/doubts/:doubtId", authEducator, deleteDoubt);
educatorRouter.put("/doubts/:doubtId/reply/:replyId", authEducator, editDoubtReply);
educatorRouter.delete("/doubts/:doubtId/reply/:replyId", authEducator, deleteDoubtReply);


educatorRouter.post("/assignment/create", authEducator, createAssignment);

educatorRouter.get("/assignment/:assignmentId/submissions", authEducator, getSubmissionsForAssignment);

educatorRouter.put("/assignment/grade", authEducator, gradeSubmission);
educatorRouter.get("/assignments", authEducator, getEducatorAssignments);

export default educatorRouter;