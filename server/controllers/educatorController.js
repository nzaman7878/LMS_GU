import educatorModel from "../models/educatorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Course from "../models/courseModel.js";
import { Purchase } from "../models/purchaseModel.js";
import studentModel from "../models/studentModel.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import InterviewAttempt from "../models/InterviewAttempt.js";


// LOGIN

const educatorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const educator = await educatorModel.findOne({ email });

    if (!educator) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, educator.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const eToken = jwt.sign(
      { id: educator._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      eToken,
      educator: {
        id: educator._id,
        name: educator.name,
        email: educator.email,
        subject: educator.subject,
        qualification: educator.qualification,
        experience: educator.experience,
        about: educator.about,
        image: educator.image,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET EDUCATOR PROFILE DATA
const getEducatorProfile = async (req, res) => {
  try {
    const educatorId = req.educatorId;
    const educator = await educatorModel.findById(educatorId).select("-password");

    if (!educator) {
      return res.status(404).json({ success: false, message: "Educator not found" });
    }

    res.json({ success: true, educator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE EDUCATOR PROFILE
import { v2 as cloudinary } from 'cloudinary';

const updateEducatorProfile = async (req, res) => {
  try {
    const educatorId = req.educatorId;
    const { name, subject, qualification, experience, about } = req.body;
    const imageFile = req.file; // This comes from multer middleware

    // Create an update object with the text fields
    const updateData = {
      name,
      subject,
      qualification,
      experience,
      about
    };

    // If a new image file is uploaded, process it with Cloudinary
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    // Find and update the educator
    const updatedEducator = await educatorModel.findByIdAndUpdate(
      educatorId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedEducator) {
      return res.status(404).json({ success: false, message: "Educator not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      educator: updatedEducator,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET EDUCATOR COURSES

const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.educatorId; // ✅ CORRECT

    const courses = await Course.find({ educator });

    res.json({ success: true, courses });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// DASHBOARD DATA

const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.educatorId; 

    const courses = await Course.find({ educator });

    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await studentModel.find(
        { _id: { $in: course.enrolledStudents } },
        "name image"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ENROLLED STUDENTS

const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.educatorId; 

    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name image") // Student model
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




// CREATE A NEW INTERVIEW QUESTION
const createInterviewQuestion = async (req, res) => {
  try {
    const educatorId = req.educatorId; 
    const { questionText, idealAnswer, hint, category } = req.body;

    const newQuestion = new InterviewQuestion({
      educatorId,
      questionText,
      idealAnswer,
      hint,
      category
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Interview question created successfully",
      question: newQuestion
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL QUESTIONS CREATED BY THIS EDUCATOR
const getEducatorInterviewQuestions = async (req, res) => {
  try {
    const educatorId = req.educatorId;
    const questions = await InterviewQuestion.find({ educatorId }).sort({ createdAt: -1 });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL STUDENT SUBMISSIONS FOR THIS EDUCATOR'S QUESTIONS
const getInterviewSubmissions = async (req, res) => {
  try {
    const educatorId = req.educatorId;

 
    const questions = await InterviewQuestion.find({ educatorId });
    const questionIds = questions.map(q => q._id);

   
    const submissions = await InterviewAttempt.find({ questionId: { $in: questionIds } })
      .populate("studentId", "name image") 
      .populate("questionId", "questionText idealAnswer category") 
      .sort({ createdAt: -1 }); 

    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REVIEW AND GRADE A STUDENT'S ATTEMPT
const reviewInterviewSubmission = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { score, educatorFeedback } = req.body;

    const updatedAttempt = await InterviewAttempt.findByIdAndUpdate(
      attemptId,
      {
        status: "Reviewed",
        score,
        educatorFeedback
      },
      { new: true, runValidators: true }
    );

    if (!updatedAttempt) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    res.json({
      success: true,
      message: "Review submitted successfully",
      attempt: updatedAttempt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  educatorLogin,
  getEducatorProfile,   
  updateEducatorProfile,
  getEducatorCourses,
  educatorDashboardData,
  getEnrolledStudentsData,
  createInterviewQuestion,
  getEducatorInterviewQuestions,
  getInterviewSubmissions,
  reviewInterviewSubmission
};