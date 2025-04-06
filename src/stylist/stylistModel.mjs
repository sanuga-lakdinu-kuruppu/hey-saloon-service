import mongoose from "mongoose";

const stylistSchema = new mongoose.Schema(
  {
    stylistId: {
      type: Number,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: Number,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    saloonName: {
      type: String,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    rating: {
      type: Number,
    },
    totalRating: {
      type: Number,
    },
    isOpen: {
      type: Boolean,
    },
    start: {
      type: String,
    },
    end: {
      type: String,
    },
    totalQueued: {
      type: Number,
    },
    finishedAt: {
      type: Date,
    },
    portfolio: [
      {
        id: {
          type: Number,
        },
        message: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
        likes: {
          type: [Number],
        },
      },
    ],
    services: [
      {
        id: {
          type: Number,
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        minutes: {
          type: Number,
        },
      },
    ],
    bookings: [
      {
        id: {
          type: Number,
        },
        userId: {
          type: Number,
        },
        bookingTime: {
          type: Date,
        },
        queuedAt: {
          type: Number,
        },
        serviceAt: {
          type: Date,
        },
        serviceTime: {
          type: Number,
        },
        bookingStatus: {
          type: String,
        },
        selectedServices: [
          {
            id: {
              type: Number,
            },
            name: {
              type: String,
            },
            price: {
              type: Number,
            },
            minutes: {
              type: Number,
            },
          },
        ],
        serviceTotal: {
          type: Number,
        },
      },
    ],
    reviews: [
      {
        id: {
          type: Number,
        },
        userId: {
          type: Number,
        },
        rating: {
          type: Number,
        },
        message: {
          type: String,
        },
        reviewedAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

stylistSchema.index({ location: "2dsphere" });

export const Stylist = mongoose.model("Stylist", stylistSchema);
