import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userType: { type: String, enum: ['Student', 'Educator'], required: true },
  name: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

const doubtSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lectureId: { type: String, required: true }, 
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  questionText: { type: String, required: true },
  replies: [replySchema]
}, { timestamps: true });

export default mongoose.model('Doubt', doubtSchema);