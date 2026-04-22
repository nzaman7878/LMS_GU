import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true, 
      trim: true 
    },
    discountPercentage: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 100 
    },
    
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course", 
      default: null 
    },
    educatorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "educator", 
      required: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    expiryDate: { 
      type: Date, 
      required: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);