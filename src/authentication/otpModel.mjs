import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    otp: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const Otp = mongoose.model("Otp", otpSchema);
