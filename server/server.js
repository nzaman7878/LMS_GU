import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";

import educatorRoute from "./routes/educatorRoute.js";
import adminRoute from "./routes/adminRoute.js";
import courseRoute from "./routes/courseRoute.js";
import studentRoute from "./routes/studentRoute.js";

import { stripeWebhooks } from "./controllers/webhookController.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true,
}));

app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

app.use(express.json());


app.use("/images", express.static("uploads"));

app.use("/api/admin", adminRoute);
app.use("/api/educator", educatorRoute);
app.use("/api/students", studentRoute);
app.use("/api/course", courseRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});