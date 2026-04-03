import Stripe from "stripe";
import studentModel from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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


// ✅ Login Student
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

    console.log("🧾 Purchase Created:", newPurchase._id);

   
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

    console.log("💳 Stripe Session Created:", session.id);

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

export {
  registerStudent,
  loginStudent,
  getStudentData,
  studentEnrolledCourses,
  purchaseCourse,
};