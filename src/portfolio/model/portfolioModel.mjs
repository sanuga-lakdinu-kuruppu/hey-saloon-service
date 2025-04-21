import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    portfolioId: {
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
    stylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stylist",
      required: true,
    },
    imageUrl: {
      type: String,
    },
    name: {
      type: String,
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
