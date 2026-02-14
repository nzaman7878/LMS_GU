import jwt from "jsonwebtoken";

const authTeacher = async (req, res, next) => {
  try {
    const { ttoken } = req.headers; 

    

    if (!ttoken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(ttoken, process.env.JWT_SECRET);

    req.teacherId = decoded.id;
    next();

  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authTeacher;
