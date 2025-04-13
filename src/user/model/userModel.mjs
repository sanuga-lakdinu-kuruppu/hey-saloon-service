import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
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
    role: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    firstLogin: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
    },
    isDisabled: {
      type: Boolean,
    },
    isDeleted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
