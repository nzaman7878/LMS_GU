import mongoose from 'mongoose'; 

const interviewQuestionSchema = new mongoose.Schema({
  educatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'educator', 
    required: true 
  },
  questionText: { 
    type: String, 
    required: true 
  },
  idealAnswer: { 
    type: String, 
    required: true 
  },
  hint: { 
    type: String 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Web Dev', 'AI/ML', 'Data Science', 'App Dev', 'Soft Skills'] 
  }
}, { timestamps: true });

export default mongoose.model('InterviewQuestion', interviewQuestionSchema);