import courseModel from "../models/courseModel.js";
import teacherModel from "../models/teacherModel.js";


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

export { createCourse };
