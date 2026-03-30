import educatorModel from "../models/educatorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Course from "../models/courseModel.js";
import { Purchase } from "../models/purchaseModel.js";
import studentModel from "../models/studentModel.js";

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


const getEducatorCourses = async (req, res) => {

  try {
    const educator = req.educatorId; 

    const courses = await Course.find({ educator });

    res.json({ success: true, courses });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;

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


 const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
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



export { educatorLogin , getEducatorCourses , educatorDashboardData , getEnrolledStudentsData};