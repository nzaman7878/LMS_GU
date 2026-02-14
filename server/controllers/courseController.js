import courseModel from "../models/courseModel.js";
import teacherModel from "../models/teacherModel.js";
import cloudinary from "../config/cloudinary.js";


const createCourse = async (req, res) => {
  try {
    const teacherId = req.teacherId;

    const { title, description, modules, price } = req.body;

    
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

 
    const newCourse = new courseModel({
      title,
      description,
      teacher: teacherId,
      modules,
      price,
    });

    await newCourse.save();

   
    teacher.courses.push(newCourse._id);
    await teacher.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

import mongoose from "mongoose";

const addLecture = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, duration } = req.body;
    const teacherId = req.teacherId;

    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Module ID",
      });
    }

    
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    
    if (course.teacher.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

   
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

   
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    
    module.lectures.push({
      title,
      videoUrl: result.secure_url,
      duration,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture added successfully",
      data: module,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export { createCourse, addLecture  };
