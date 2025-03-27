import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    session: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    email: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
    },
    mobile: {
      type: String,
    },
    isMobileVerified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
