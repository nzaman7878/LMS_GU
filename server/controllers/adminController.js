import jwt from "jsonwebtoken";
import educatorModel from "../models/educatorModel.js";
import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";

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

export {registerAdmin, loginAdmin, addEducator};