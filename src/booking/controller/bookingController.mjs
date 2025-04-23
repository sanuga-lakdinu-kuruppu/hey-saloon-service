import { Router } from "express";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import { createBooking, getAllBookings } from "../service/bookingService.mjs";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";

const router = Router();

router.post(
  "/bookings",
  protectRoute(["STYLIST", "CLIENT"]),
  async (request, response) => {
    try {
      const { body } = request;

      const { res, booking } = await createBooking(body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Booking created successfully",
          data: booking,
        });
      } else {
        return response.status(500).json({ error: "Server error occured" });
      }
    } catch (error) {
      console.log(`error occured ${error}`);
      return response.status(500).json({ error: "server error occured" });
    }
  }
);

router.get(
  "/bookings/clientId/:clientId",
  protectRoute(["STYLIST", "CLIENT"]),
  async (request, response) => {
    try {
      const { clientId } = request.params;
      const { status } = request.query;

      const { res, bookings } = await getAllBookings(clientId, status);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Bookings retrived  successfully",
          data: bookings,
        });
      } else {
        return response.status(500).json({ error: "Server error occured" });
      }
    } catch (error) {
      console.log(`error occured ${error}`);
      return response.status(500).json({ error: "server error occured" });
    }
  }
);

export default router;
