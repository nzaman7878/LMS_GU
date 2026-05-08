import jwt from "jsonwebtoken";
import educatorModel from "../models/educatorModel.js";
import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import studentModel from "../models/studentModel.js";
import { Purchase } from '../models/purchaseModel.js';
import Course from "../models/courseModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

 const registerAdmin = async (req, res) => {

  try {
    const { email, password, name } = req.body;


    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

   
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const loginAdmin = async (req, res) => {
  
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

   
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

 
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        email: admin.email,
        name: admin.name,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const addEducator = async (req, res) => {
    try {
        const { name, email, password, subject, qualification, experience, about } = req.body;

     
        if (!name || !email || !password) {
            if (req.file) fs.unlinkSync(req.file.path); // Delete file if validation fails
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

      
        const existingEducator = await educatorModel.findOne({ email });
        if (existingEducator) {
            fs.unlinkSync(req.file.path); 
            return res.status(400).json({ success: false, message: "Educator already exists" });
        }

        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "educator_profiles" 
        });

      
        fs.unlinkSync(req.file.path); 
        
        const imageUrl = imageUpload.secure_url;

     
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEducator = new educatorModel({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            subject,
            qualification,
            experience,
            about,
        });

        await newEducator.save();

        res.status(201).json({
            success: true,
            message: "Educator added successfully",
            educator: {
                _id: newEducator._id,
                name: newEducator.name,
                email: newEducator.email,
                image: newEducator.image,
            },
        });

    } catch (error) {
        
        if (req.file) fs.unlinkSync(req.file.path);
        
        console.error("Add Educator Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllEducators = async (req, res) => {
    try {
        
        const educators = await educatorModel.find({})
            .select('-password')
            .sort({ joinedAt: -1 }); 

      
        const formattedEducators = educators.map(educator => {
            const eduObj = educator.toObject();
           
            if (!eduObj.image || !eduObj.image.startsWith('http')) {
               
            }
            
            return eduObj;
        });

        res.json({ 
            success: true, 
            educators: formattedEducators 
        });

    } catch (error) {
        console.error("Get All Educators Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch educators" 
        });
    }
};

const updateEducator = async (req, res) => {
    try {
        const { userId, name, email, password, subject, qualification, experience, about } = req.body;
        
        
        const updateData = {
            name,
            email,
            subject,
            qualification,
            experience,
            about
        };

        
        if (password && typeof password === 'string' && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

      
        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "image",
                    folder: "educator_profiles"
                });

                updateData.image = imageUpload.secure_url;

               
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(500).json({ success: false, message: "Image upload to Cloudinary failed" });
            }
        }

        const updatedEducator = await educatorModel.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true, runValidators: true } 
        ).select("-password"); 

        if (!updatedEducator) {
            return res.status(404).json({ success: false, message: "Educator not found" });
        }

        res.json({ 
            success: true, 
            message: "Educator profile and password updated successfully", 
            educator: updatedEducator 
        });

    } catch (error) {
        
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Update Educator Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteEducator = async (req, res) => {
    try {
        const { userId } = req.body;
        await educatorModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "Educator Removed Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


 const getAllStudents = async (req, res) => {
    try {
        const students = await studentModel.find({})
            .select("-password")
            .populate({
                path: 'enrolledCourses',
                select: 'courseTitle' 
            });
        
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { 
            userId, 
            name, 
            email, 
            mobile, 
            gender, 
            university, 
            education, 
            address 
        } = req.body;
        
        const updatedStudent = await studentModel.findByIdAndUpdate(
            userId, 
            { 
                name, 
                email, 
                mobile, 
                gender, 
                university, 
                education, 
                address 
            }, 
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({ 
            success: true, 
            message: "Student profile updated", 
            student: updatedStudent 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { userId } = req.body;
        await studentModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

 const getAllCoursesAdmin = async (req, res) => {
  try {
 
    const courses = await Course.find({}).populate("educator", "name");
    
    res.status(200).json({ 
        success: true, 
        courses 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 const deleteCourseAdmin = async (req, res) => {
  try {
    const { courseId } = req.params; 

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await studentModel.countDocuments(); 
    const totalEducators = await educatorModel.countDocuments(); 

    const courses = await Course.find({}, "coursePrice enrolledStudents discount");
    
    let totalRevenue = 0;
    courses.forEach((course) => {
      const actualPrice = course.coursePrice - (course.coursePrice * (course.discount / 100));
      const studentsCount = course.enrolledStudents ? course.enrolledStudents.length : 0;
      
      totalRevenue += (actualPrice * studentsCount);
    });

    const recentEnrollments = await Purchase.find({ status: "completed" }) 
      .sort({ createdAt: -1 }) 
      .populate('userId', 'name') 
      
      .populate('courseId', 'courseTitle'); 

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalEducators,
        totalRevenue,
        recentEnrollments, 
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {registerAdmin, loginAdmin, addEducator , getAllEducators , updateEducator, deleteEducator , getAllStudents , updateStudent , deleteStudent , getAllCoursesAdmin , deleteCourseAdmin , getDashboardStats };