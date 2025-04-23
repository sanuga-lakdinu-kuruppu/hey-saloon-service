import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
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
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    status: {
      type: String,
    },
    servicesSelected: [
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
    queuedAt: {
      type: Number,
    },
    serviceWillTake: {
      type: Number,
    },
    estimatedStarting: {
      type: Date,
    },
    serviceTotal: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);
