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
    saloonLat: {
      type: Number,
    },
    saloonLog: {
      type: Number,
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
        time: {
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
            time: {
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

export const Stylist = mongoose.model("Stylist", stylistSchema);

// const v = {
//   stylistId: 19095993,
//   userId: 1001,
//   firstName: "John",
//   lastName: "Doe",
//   thumbnailUrl: "https://example.com/john-thumbnail.jpg",
//   imageUrl: "https://example.com/john-image.jpg",
//   saloonName: "Luxury Salon",
//   saloonLat: 40.712776,
//   saloonLog: -74.005974,
//   rating: 4.5,
//   totalRating: 150,
//   isOpen: true,
//   start: new Date(),
//   end: new Date(),
//   totalQueued: 5,
//   finishedAt: new Date(),
//   portfolio: [
//     {
//       id: 1,
//       message: "Stylish haircut",
//       imageUrl: "https://example.com/haircut1.jpg",
//       likes: [1, 2, 3],
//     },
//     {
//       id: 2,
//       message: "Coloring",
//       imageUrl: "https://example.com/coloring1.jpg",
//       likes: [1, 3],
//     },
//   ],
//   services: [
//     {
//       id: 1,
//       name: "Haircut",
//       price: 50,
//       time: 30,
//     },
//     {
//       id: 2,
//       name: "Shaving",
//       price: 20,
//       time: 15,
//     },
//   ],
//   bookings: [
//     {
//       id: 1,
//       userId: 2001,
//       bookingTime: new Date(),
//       queuedAt: 10,
//       serviceAt: new Date(),
//       serviceTime: 30,
//       bookingStatus: "Completed",
//       selectedServices: [
//         {
//           id: 1,
//           name: "Haircut",
//           price: 50,
//           time: 30,
//         },
//       ],
//       serviceTotal: 50,
//     },
//   ],
//   reviews: [
//     {
//       id: 1,
//       userId: 2001,
//       rating: 5,
//       message: "Excellent service!",
//       reviewedAt: new Date(),
//     },
//   ],
// };
