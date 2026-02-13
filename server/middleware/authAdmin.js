import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied"
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token"
    });
  }
};

export default authAdmin;
