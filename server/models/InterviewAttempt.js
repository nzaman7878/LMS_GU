import mongoose from 'mongoose'; 

const interviewAttemptSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'InterviewQuestion', 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Web Dev', 'AI/ML', 'Data Science', 'App Dev', 'Soft Skills'] 
  },
  submittedAnswer: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed'], 
    default: 'Pending' 
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  educatorFeedback: { 
    type: String 
  }
}, { timestamps: true });

export default mongoose.model('InterviewAttempt', interviewAttemptSchema);