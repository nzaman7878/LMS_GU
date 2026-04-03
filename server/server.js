import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";

import educatorRoute from "./routes/educatorRoute.js";
import adminRoute from "./routes/adminRoute.js";
import courseRoute from "./routes/courseRoute.js";
import studentRoute from "./routes/studentRoute.js";

import { stripeWebhooks } from "./controllers/webhookController.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();


app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// ✅ 3. ROUTES
app.use("/api/admin", adminRoute);
app.use("/api/educator", educatorRoute);
app.use("/api/students", studentRoute);
app.use("/api/course", courseRoute);

// ✅ 4. TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});