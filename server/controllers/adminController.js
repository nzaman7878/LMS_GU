import jwt from "jsonwebtoken";


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      
      const token = jwt.sign(
        { email, role: "admin" },  
        process.env.JWT_SECRET,
        { expiresIn: "7d" }        
      );

      return res.status(200).json({
        success: true,
        token
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {loginAdmin };