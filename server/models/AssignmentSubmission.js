import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  
  
  answerText: { type: String },
  fileUrl: { type: String },   
  
 
  status: { type: String, enum: ["Pending", "Graded"], default: "Pending" },
  marksAwarded: { type: Number, default: null },
  educatorFeedback: { type: String, default: "" }
}, { timestamps: true });


submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.AssignmentSubmission || mongoose.model("AssignmentSubmission", submissionSchema);