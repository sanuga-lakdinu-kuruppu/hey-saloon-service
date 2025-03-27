import { Router } from "express";
import { verificationMiddleware } from "../authentication/verificationMiddleware.mjs";
import { getFavoriteStylists } from "./stylistService.mjs";
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
      saloonLat: body.saloonLat,
      saloonLog: body.saloonLog,
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
