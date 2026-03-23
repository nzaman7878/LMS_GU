import jwt from "jsonwebtoken";

const authEducator = async (req, res, next) => {
  try {
 
    const { etoken } = req.headers;

    if (!etoken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(etoken, process.env.JWT_SECRET);

  
    req.educatorId = decoded.id;

    next();

  } catch (error) {
   
    if (error.name === "TokenExpiredError") {
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

export default authEducator;