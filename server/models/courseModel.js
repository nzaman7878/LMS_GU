import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, 
  duration: { type: String },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lectures: [lectureSchema],
  resources: [
    {
      title: String,
      fileUrl: String, 
    },
  ],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },

    modules: [moduleSchema],

    price: { type: Number, default: 0 },

    thumbnail: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const courseModel =
  mongoose.models.course || mongoose.model("course", courseSchema);

export default courseModel;
