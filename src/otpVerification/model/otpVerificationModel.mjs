import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    verificationId: {
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
    type: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    otp: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

otpVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const OtpVerification = mongoose.model(
  "OtpVerification",
  otpVerificationSchema
);
