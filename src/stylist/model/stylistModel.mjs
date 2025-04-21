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
    isOpen: {
      type: Boolean,
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

// const StylistModelType1 = {
//   stylistId: "33234",
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   firstName: "",?
//   lastName: "",?
//   profileUrl: "",
//   saloonName: "Wix Saloon",
//   thumbnailUrl: "url",
//   isClientLiked: true,?
//   address: {?
//     no: "",
//     address1: "",
//     address2: "",
//     address3: "",
//   },
//   location: {?
//     coordinates: [432, 432],
//   },
//   startTime: "",?
//   endTime: "",?
//   services: [?
//     {
//       serviceId: "324",
//       serviceName: "fd",
//       serviceCost: 34.32,
//       serviceWillTake: 432,
//     },
//   ],
//   totalQueued: 31,?
//   queueWillEnd: new Date(),?
//   totalReviewed: 32,?
//   currentRating: 34.4,?
// };

// const StylistModelType3 = {
//   stylistId: "33234",
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   firstName: "",?
//   lastName: "",?
//   profileUrl: "",
//   saloonName: "Wix Saloon",
//   thumbnailUrl: "url",
//   isOpen: true,?
//   distance: 43.432,?
//   isClientLiked: true,?
//   address: {?
//     no: "",
//     address1: "",
//     address2: "",
//     address3: "",
//   },
//   location: {?
//     coordinates: [432, 432],
//   },
//   startTime: "",?
//   endTime: "",?
//   services: [?
//     {
//       serviceId: "324",
//       serviceName: "fd",
//       serviceCost: 34.32,
//       serviceWillTake: 432,
//     },
//   ],
//   totalQueued: 31,?
//   queueWillEnd: new Date(),?
//   totalReviewed: 32,?
//   currentRating: 34.4,?
// };
