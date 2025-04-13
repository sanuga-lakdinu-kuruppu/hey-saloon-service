import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientId: {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
    },
    contact: {
      email: {
        email: {
          type: String,
        },
        isVerified: {
          type: Boolean,
        },
      },
      mobile: {
        mobile: {
          type: String,
        },
        isVerified: {
          type: Boolean,
        },
      },
    },
    profileUrl: {
      type: String,
    },
    favouriteStylists: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Client = mongoose.model("Client", clientSchema);
