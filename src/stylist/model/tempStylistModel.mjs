import mongoose from "mongoose";

const tempStylistSchema = new mongoose.Schema(
  {
    tempStylistId: {
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
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    saloonName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

tempStylistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 800 });

export const TempStylist = mongoose.model("TempStylist", tempStylistSchema);
