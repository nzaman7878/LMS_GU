import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);


adminSchema.pre("save", async function () {
  const adminCount = await mongoose.models.Admin.countDocuments();

  if (adminCount > 0) {
    throw new Error("Only one admin is allowed");
  }
});
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;