import teacherModel from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const teacher = await teacherModel.findOne({ email });

    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    
    const token = jwt.sign(
      { id: teacher._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        qualification: teacher.qualification,
        experience: teacher.experience,
        about: teacher.about,
        image: teacher.image,
        
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

export { teacherLogin };
