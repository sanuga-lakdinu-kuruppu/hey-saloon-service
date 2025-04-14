import mongoose from "mongoose";

const stylistSchema = new mongoose.Schema(
  {
    stylistId: {
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
    saloonName: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    address: {
      no: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      address3: {
        type: String,
      },
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: false },
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    services: [
      {
        serviceId: {
          type: String,
        },
        serviceName: {
          type: String,
        },
        serviceCost: {
          type: Number,
        },
        serviceWillTake: {
          type: Number,
        },
      },
    ],
    totalQueued: {
      type: Number,
    },
    queueWillEnd: {
      type: Date,
    },
    totalReviewed: {
      type: Number,
    },
    currentRating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

stylistSchema.index({ location: "2dsphere" });

export const Stylist = mongoose.model("Stylist", stylistSchema);
