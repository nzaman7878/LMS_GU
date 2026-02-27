import studentModel from "../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const registerStudent = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    
    const existingStudent = await studentModel.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
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
      message: "Student registered successfully",
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginStudent = async (req, res) => {

  try {
    const { email, password } = req.body;

    const student = await studentModel.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerStudent, loginStudent };