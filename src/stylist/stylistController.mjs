import { Router } from "express";
import { verificationMiddleware } from "../authentication/verificationMiddleware.mjs";
import {
  getFavoriteStylists,
  getNearByStylists,
  gettopRatedStylists,
  getStylistById,
} from "./stylistService.mjs";
import { User } from "../user/userModel.mjs";
import { Stylist } from "./stylistModel.mjs";

const router = Router();

router.get(
  "/stylists/favorites",
  verificationMiddleware,
  async (request, response) => {
    try {
      const { user } = request;
      const favorites = await getFavoriteStylists(user);
      return response.send({
        status: "0000",
        message: "favorite stylists retrived successfully",
        data: favorites,
      });
    } catch (error) {
      console.log(`error occured ${error}`);
      return response.status(500).json({ error: "server error occred" });
    }
  }
);

router.get(
  "/stylists/nearBy",
  verificationMiddleware,
  async (request, response) => {
    try {
      let { lat, log } = request.query;
      const { user } = request;

      if (!lat || !log) {
        return response.send({
          status: "0000",
          message: "near by stylists retrived successfully",
          data: [],
        });
      }

      lat = parseFloat(lat);
      log = parseFloat(log);

      const near = await getNearByStylists(lat, log);
      return response.send({
        status: "0000",
        message: "near by stylists retrived successfully",
        data: near,
      });
    } catch (error) {
      console.log(`error occured ${error}`);
      return response.status(500).json({ error: "server error occred" });
    }
  }
);

router.get(
  "/stylists/topRated",
  verificationMiddleware,
  async (request, response) => {
    try {
      const { user } = request;
      const topRated = await gettopRatedStylists();
      return response.send({
        status: "0000",
        message: "top rated stylists retrived successfully",
        data: topRated,
      });
    } catch (error) {
      console.log(`error occured ${error}`);
      return response.status(500).json({ error: "server error occred" });
    }
  }
);

router.post("/bookings", verificationMiddleware, async (request, response) => {
  try {
    const { body, user } = request;

    const foundStylist = await Stylist.findOne({ stylistId: body.stylistId });

    if (!foundStylist) {
      return response.status(404).json({ error: "Stylist not found" });
    }

    let totalMinutes = 0;
    let totalAmount = 0;
    body.selectedServices.forEach((service) => {
      totalMinutes += service.minutes || 0;
      totalAmount += service.price || 0;
    });

    const booking = {
      id: generateShortUuid(),
      userId: user.userId,
      bookingTime: new Date(),
      queuedAt: (foundStylist.totalQueued || 0) + 1,
      serviceAt: foundStylist.finishedAt,
      serviceTime: totalMinutes,
      bookingStatus: "QUEUED",
      selectedServices: body.selectedServices,
      serviceTotal: totalAmount,
    };

    foundStylist.bookings.push(booking);
    foundStylist.totalQueued = booking.queuedAt;

    await foundStylist.save();

    return response.send({
      status: "0000",
      message: "Booking created",
      data: booking,
    });
  } catch (error) {
    console.error(`error occurred: ${error}`);
    return response.status(500).json({ error: "Server error occurred" });
  }
});

//temporary
router.post("/stylists/create", async (request, response) => {
  try {
    const { body } = request;
    const user = {
      userId: generateShortUuid(),
      role: "stylist",
      firstName: body.firstName,
      lastName: body.lastName,
      imageUrl: body.imageUrl,
      email: body.email,
      isEmailVerified: true,
      mobile: body.mobile,
      isMobileVerified: true,
    };
    const newUser = new User(user);
    await newUser.save();

    const stylist = {
      stylistId: generateShortUuid(),
      userId: newUser.userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      thumbnailUrl: body.thumbnailUrl,
      imageUrl: body.imageUrl,
      saloonName: body.saloonName,
      location: {
        type: "Point",
        coordinates: [body.saloonLog, body.saloonLat],
      },
      rating: body.rating,
      totalRating: body.totalRating,
      isOpen: body.isOpen,
      start: body.start,
      end: body.end,
      totalQueued: body.totalQueued,
      finishedAt: body.finishedAt,
      portfolio: [],
      services: [],
      bookings: [],
      reviews: [],
    };

    const newStylist = new Stylist(stylist);
    await newStylist.save();
    return response.send(newStylist);
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occred" });
  }
});

export const generateShortUuid = () => {
  return Math.floor(10000000 + Math.random() * 90000000);
};

export default router;
