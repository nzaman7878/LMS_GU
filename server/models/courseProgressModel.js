import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lectureCompleted: [
      {
        type: String,
      },
    ],

   quizProgress: [
      {
        quizId: { type: String, required: true },
        attempts: { type: Number, default: 0 },
        bestScore: { type: Number, default: 0 },
        userAnswers: { type: [Number], default: [] } 
      }
    ]
  },
  
  
  { minimize: false, timestamps: true }
);

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);