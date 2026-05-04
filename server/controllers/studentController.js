import Stripe from "stripe";
import studentModel from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CourseProgress } from "../models/courseProgressModel.js";
import Coupon from "../models/couponModel.js";
import courseModel from "../models/courseModel.js";
import cloudinary from "../config/cloudinary.js";
import { Purchase } from "../models/purchaseModel.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import InterviewAttempt from "../models/InterviewAttempt.js";
import Doubt from "../models/Doubt.js";
import Assignment from "../models/Assignment.js";
import AssignmentSubmission from "../models/AssignmentSubmission.js";

import { OAuth2Client } from "google-auth-library";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const registerStudent = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await studentModel.create({
      name,
      email,
      password: hashedPassword,
      image,
    });

   
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Login Student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await studentModel.findOne({ email });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Google token is required" });
    }

   
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    

    const { email, name, picture } = ticket.getPayload();

   
    let student = await studentModel.findOne({ email });

    
    if (!student) {
     
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newStudent = new studentModel({
        name: name,
        email: email,
        password: hashedPassword,
        image: picture 
      });
      
      student = await newStudent.save();
    }

    
    const jwtToken = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Google Login successful",
      token: jwtToken,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        image: student.image
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Google authentication failed: " + error.message,
    });
  }
};


// Update Student Profile
const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.auth.id || req.auth.userId;

    const {
      name,
      gender,
      mobile,
      university,
      education,
      address,
    } = req.body;

    const updateData = {};

    if (name && name !== "undefined") updateData.name = name;
    if (gender && gender !== "undefined") updateData.gender = gender;
    if (mobile && mobile !== "undefined") updateData.mobile = mobile;
    if (university && university !== "undefined") updateData.university = university;
    if (education && education !== "undefined") updateData.education = education;
    if (address && address !== "undefined") updateData.address = address;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.image = result.secure_url;
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getStudentData = async (req, res) => {
  try {
    const studentId = req.auth.userId;

    const student = await studentModel
      .findById(studentId)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Get Enrolled Courses
const studentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.auth.userId;

    const studentData = await studentModel
      .findById(studentId)
      .populate("enrolledCourses");

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    res.json({
      success: true,
      enrolledCourses: studentData.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const origin = process.env.CLIENT_URL;
    const studentId = req.auth.userId;

    const studentData = await studentModel.findById(studentId);
    const courseData = await Course.findById(courseId);

    if (!studentData || !courseData) {
      return res.json({
        success: false,
        message: "Data Not Found",
      });
    }

    if (
      studentData.enrolledCourses.some(
        (id) => id.toString() === courseId.toString()
      )
    ) {
      return res.json({
        success: false,
        message: "Already Enrolled",
      });
    }

    const amount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100;

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId: studentId,
      amount,
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(amount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log("Purchase Error:", error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Course Progress
 const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    let progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      progressData = await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({
      success: true,
      message: "Progress Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get User Course Progress
const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });

    res.json({
      success: true,
      progressData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Add User Ratings to Course
const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({
      success: false,
      message: "Invalid Details",
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({
        success: false,
        message: "Course not found.",
      });
    }

    const student = await studentModel.findById(userId);

    const isEnrolled = student?.enrolledCourses.some(
      (id) => id.toString() === courseId.toString()
    );

    if (!student || !isEnrolled) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    const totalRatings = course.courseRatings.length;
    const avgRating =
      course.courseRatings.reduce((acc, item) => acc + item.rating, 0) /
      totalRatings;

    return res.json({
      success: true,
      message: "Rating added successfully",
      courseRatings: course.courseRatings,
      averageRating: avgRating.toFixed(1),
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;
    
    const studentId = req.auth?.id || req.auth?.userId || req.user?.id || req.studentId; 

    if (!studentId) {
       return res.json({ success: false, message: "Authentication failed. User ID not found." });
    }

    if (!courseId) throw new Error("Course ID is required");

    const course = await courseModel.findById(courseId);
    if (!course) throw new Error("Course not found");

    const student = await studentModel.findById(studentId);
    if (!student) throw new Error("Student not found");

    if (student.enrolledCourses.some((id) => id.toString() === courseId.toString())) {
      return res.json({ success: false, message: "You are already enrolled in this course." });
    }

    let isFree = false;

    const baseDiscountAmount = (course.coursePrice * course.discount) / 100;
    const priceAfterBaseDiscount = course.coursePrice - baseDiscountAmount;

    if (priceAfterBaseDiscount <= 0) {
      isFree = true;
    }

    if (!isFree && couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      
      if (!coupon) {
        return res.json({ success: false, message: "Invalid or inactive coupon code." });
      }
      if (new Date() > new Date(coupon.expiryDate)) {
        return res.json({ success: false, message: "This coupon has expired." });
      }
      if (coupon.courseId && coupon.courseId.toString() !== courseId) {
        return res.json({ success: false, message: "Coupon is not valid for this course." });
      }

      const couponDiscountAmount = (priceAfterBaseDiscount * coupon.discountPercentage) / 100;
      const finalPrice = priceAfterBaseDiscount - couponDiscountAmount;

      if (finalPrice <= 0) {
        isFree = true;
      }
    }

    if (!isFree) {
      return res.json({ 
        success: false, 
        message: "Course is not free. Please complete the payment process." 
      });
    }

    course.enrolledStudents.push(student._id);
    await course.save();

    student.enrolledCourses.push(course._id);
    await student.save();

    await Purchase.create({
      courseId: course._id,
      userId: student._id,
      amount: 0,
      status: "completed", 
    });

    return res.json({
      success: true,
      message: "Successfully enrolled in the course for free!",
    });

  } catch (error) {
    console.error("Free Enrollment Error:", error);
    res.json({ success: false, message: error.message });
  }
};


const submitQuizScore = async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const { courseId, quizId, score, userAnswers } = req.body; 

    if (!courseId || !quizId || score === undefined) {
      throw new Error("Missing required fields");
    }

    let progressData = await CourseProgress.findOne({ userId, courseId });
    
    if (!progressData) {
      progressData = await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [],
        quizProgress: []
      });
    }

    const quizIndex = progressData.quizProgress.findIndex(q => q.quizId === quizId);

    if (quizIndex > -1) {
      if (progressData.quizProgress[quizIndex].attempts >= 1) {
        return res.json({ success: false, message: "Maximum attempts reached." });
      }
      
      progressData.quizProgress[quizIndex].attempts += 1;
      progressData.quizProgress[quizIndex].bestScore = Math.max(progressData.quizProgress[quizIndex].bestScore, score);
      
      progressData.quizProgress[quizIndex].userAnswers = userAnswers; 
    } else {
      progressData.quizProgress.push({
        quizId,
        attempts: 1,
        bestScore: score,
        userAnswers 
      });
    }

    await progressData.save();

    res.json({ success: true, message: "Quiz score saved successfully!", progressData });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const getStudentInterviews = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const questions = await InterviewQuestion.find(query)
      .select("-idealAnswer")
      .sort({ createdAt: -1 });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const submitInterviewAttempt = async (req, res) => {
  try {
    const studentId = req.auth?.userId || req.auth?.id || req.body.studentId; 
    
    const { questionId, category, submittedAnswer } = req.body;

    if (!studentId) {
      return res.status(401).json({ success: false, message: "Authentication failed. Student ID missing." });
    }

    if (!questionId || !submittedAnswer) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newAttempt = new InterviewAttempt({
      studentId,
      questionId,
      category,
      submittedAnswer
    });

    await newAttempt.save();

    res.status(201).json({ 
      success: true, 
      message: "Answer submitted successfully", 
      attempt: newAttempt 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyInterviewAttempts = async (req, res) => {
  try {
    const studentId = req.auth?.userId || req.auth?.id;

    if (!studentId) {
      return res.status(401).json({ success: false, message: "Authentication failed." });
    }

    const attempts = await InterviewAttempt.find({ studentId })
      .populate('questionId', 'questionText idealAnswer')
      .sort({ createdAt: -1 });

    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL DOUBTS FOR A LECTURE
const getLectureDoubts = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const doubts = await Doubt.find({ courseId, lectureId }).sort({ createdAt: -1 });
    res.json({ success: true, doubts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// STUDENT ASKS A NEW DOUBT
const askDoubt = async (req, res) => {
  try {
    const studentId = req.auth?.userId || req.auth?.id || req.body.studentId;
    const { courseId, lectureId, studentName, questionText } = req.body;

    const newDoubt = new Doubt({
      courseId, lectureId, studentId, studentName, questionText
    });

    await newDoubt.save();
    res.status(201).json({ success: true, doubt: newDoubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ANYONE REPLIES TO A DOUBT
const replyToDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;

    const { userId, userType, name, text } = req.body; 

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ success: false, message: "Doubt not found" });

    doubt.replies.push({ userId, userType, name, text });
    await doubt.save();

    res.json({ success: true, doubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteStudentDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const studentId = req.auth?.userId || req.auth?.id || req.body.studentId;

    const deletedDoubt = await Doubt.findOneAndDelete({ _id: doubtId, studentId: studentId });

    if (!deletedDoubt) {
      return res.status(404).json({ success: false, message: "Question not found or you are not authorized to delete it." });
    }

    res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EDIT THEIR OWN DOUBT
const editStudentDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const studentId = req.auth?.userId || req.auth?.id || req.body.studentId;
    const { questionText } = req.body;

    const updatedDoubt = await Doubt.findOneAndUpdate(
      { _id: doubtId, studentId: studentId },
      { questionText },
      { new: true }
    );

    if (!updatedDoubt) {
      return res.status(404).json({ success: false, message: "Question not found or unauthorized." });
    }

    res.json({ success: true, message: "Question updated", doubt: updatedDoubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE THEIR OWN REPLY
const deleteStudentReply = async (req, res) => {
  try {
    const { doubtId, replyId } = req.params;
    const studentId = req.auth?.userId || req.auth?.id || req.body.studentId;

    const updatedDoubt = await Doubt.findOneAndUpdate(
      { _id: doubtId },
      { $pull: { replies: { _id: replyId, userId: studentId } } },
      { new: true }
    );

    res.json({ success: true, message: "Reply deleted successfully", doubt: updatedDoubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EDIT THEIR OWN REPLY
const editStudentReply = async (req, res) => {
  try {
    const { doubtId, replyId } = req.params;
    const studentId = req.auth?.userId || req.auth?.id || req.body.studentId;
    const { text } = req.body;

    const updatedDoubt = await Doubt.findOneAndUpdate(
      { _id: doubtId, "replies._id": replyId, "replies.userId": studentId },
      { $set: { "replies.$.text": text } },
      { new: true }
    );

    if (!updatedDoubt) {
      return res.status(404).json({ success: false, message: "Reply not found or unauthorized." });
    }

    res.json({ success: true, message: "Reply updated successfully", doubt: updatedDoubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLectureAssignments = async (req, res) => {
  try {
    const { lectureId } = req.params;
    
   
    const studentId = req.auth?.id || req.auth?.userId;

    if (!studentId) {
       return res.status(401).json({ success: false, message: "Authentication failed. Student ID missing." });
    }

  
    const assignments = await Assignment.find({ lectureId });

   
    const submissions = await AssignmentSubmission.find({ 
      studentId, 
      assignmentId: { $in: assignments.map(a => a._id) } 
    });

    res.status(200).json({ success: true, assignments, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    
    const studentId = req.auth?.id || req.auth?.userId;
    
    const { assignmentId, answerText } = req.body;
    let fileUrl = "";

    if (!studentId) {
       return res.status(401).json({ success: false, message: "Authentication failed. Student ID missing." });
    }

    
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        fileUrl = result.secure_url;
    }

    const newSubmission = new AssignmentSubmission({
      assignmentId,
      studentId,
      answerText,
      fileUrl
    });

    await newSubmission.save();
    res.status(201).json({ success: true, message: "Assignment submitted successfully!" });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: "You have already submitted this assignment." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerStudent,
  loginStudent,
  googleLogin, 
  getStudentData,
  studentEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
  updateStudentProfile,
  enrollFreeCourse,
  submitQuizScore,
  getStudentInterviews,
  submitInterviewAttempt,
  getMyInterviewAttempts,
  getLectureDoubts, askDoubt, replyToDoubt,
  deleteStudentDoubt, editStudentDoubt, deleteStudentReply, editStudentReply,
  getLectureAssignments,
  submitAssignment
};