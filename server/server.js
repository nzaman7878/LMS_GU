import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import teacherRoute from "./routes/teacherRoute.js";
import adminRoute from "./routes/adminRoute.js";
import courseRoute from "./routes/courseRoute.js";
import studentRoute from "./routes/studentRoute.js";



const app = express();
const port = process.env.PORT || 3000;

connectDB(); 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api/admin", adminRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/students", studentRoute);
app.use("/api/course", courseRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
