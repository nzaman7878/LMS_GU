import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      trim: true,      
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "", 
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true, 
    },
    university: {
      type: String,
    },
    education: {
      type: String, 
    },
    address: {
      type: String,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;