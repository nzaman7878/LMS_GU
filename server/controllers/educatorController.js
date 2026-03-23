import educatorModel from "../models/educatorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export { educatorLogin };