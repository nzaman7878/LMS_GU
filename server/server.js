import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import teacherRoute from "./routes/teacherRoute.js";
import adminRoute from "./routes/adminRoute.js";
import courseRoute from "./routes/courseRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();


app.use(express.json());

app.use("/api/admin", adminRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/course", courseRoute);



app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
