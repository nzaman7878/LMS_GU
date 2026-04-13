import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

   
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter valid mobile number"],
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