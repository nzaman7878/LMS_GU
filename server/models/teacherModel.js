import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    image: { type: String, required: true },
     
    subject: { type: String, required: true }, 

    qualification: { type: String, required: true }, 

    experience: { type: String, required: true },

    about: { type: String, required: true },

    joinedAt: { type: Date, default: Date.now },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ], 
  },
  { minimize: false }
);

const teacherModel =
  mongoose.models.teacher || mongoose.model("teacher", teacherSchema);

export default teacherModel;
