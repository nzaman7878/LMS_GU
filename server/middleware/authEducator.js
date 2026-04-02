import jwt from "jsonwebtoken";

const authEducator = async (req, res, next) => {
  try {
    const token =
      req.headers.etoken || 
      req.headers.authorization?.split(" ")[1]; 

    console.log("TOKEN:", token); // debug

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.educatorId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authEducator;