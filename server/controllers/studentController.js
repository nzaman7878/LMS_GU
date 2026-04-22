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



//  Register Student
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

    //  Generate token
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


//  Login Student
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

    if (university && university !== "undefined")
      updateData.university = university;

    if (education && education !== "undefined")
      updateData.education = education;

    if (address && address !== "undefined")
      updateData.address = address;

   
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
// Get Student Data
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

export {
  registerStudent,
  loginStudent,
  getStudentData,
  studentEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
  updateStudentProfile,
  enrollFreeCourse,
};