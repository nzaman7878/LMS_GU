import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  lectureId: { type: String, required: true }, 
  educatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Educator", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }, 
  totalMarks: { type: Number, default: 100 },
  dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);