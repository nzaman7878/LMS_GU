import jwt from "jsonwebtoken";
import educatorModel from "../models/educatorModel.js";
import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import studentModel from "../models/studentModel.js";
import Course from "../models/courseModel.js";

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
    const {
      name,
      email,
      password,
      subject,
      qualification,
      experience,
      about,
    } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, and Password are required",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const image = req.file.filename;

    const existingEducator = await educatorModel.findOne({ email });

    if (existingEducator) {
      return res.status(400).json({
        success: false,
        message: "Educator already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const newEducator = new educatorModel({
      name,
      email,
      password: hashedPassword,
      image,
      subject,
      qualification,
      experience,
      about,
    });

    await newEducator.save();

    res.status(201).json({
      success: true,
      message: "Educator added successfully",
      educator: newEducator,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const getAllEducators = async (req, res) => {
    try {
        
        const educators = await educatorModel.find({}).select('-password');
        res.json({ success: true, educators });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

       
        if (req.file) {
            updateData.image = req.file.filename;
        }

       
        if (password && password.length > 0) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedEducator = await educatorModel.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true } 
        );

        if (!updatedEducator) {
            return res.status(404).json({ success: false, message: "Educator not found" });
        }

        res.json({ 
            success: true, 
            message: "Educator updated successfully", 
            educator: updatedEducator 
        });

    } catch (error) {
        console.log(error);
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

export {registerAdmin, loginAdmin, addEducator , getAllEducators , updateEducator, deleteEducator , getAllStudents , updateStudent , deleteStudent , getAllCoursesAdmin , deleteCourseAdmin };