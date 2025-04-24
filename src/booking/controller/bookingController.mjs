import { Router } from "express";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import {
  createBooking,
  getAllBookings,
  updateBookingStatus,
} from "../service/bookingService.mjs";
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

router.patch(
  "/bookings/:bookingId/status",
  // protectRoute(["STYLIST", "CLIENT"]),
  async (request, response) => {
    try {
      const { bookingId } = request.params;
      const { status } = request.body;

      if (!["STARTED", "COMPLETED", "PAID", "CANCELLED"].includes(status)) {
        return response.status(400).json({ error: "Invalid status" });
      }

      const { res, updatedBooking } = await updateBookingStatus(
        bookingId,
        status
      );

      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "booking status updated successfully",
          data: updatedBooking,
        });
      } else {
        return response.status(500).json({ error: "server error occurred" });
      }
    } catch (error) {
      console.log(`error occurred ${error}`);
      return response.status(500).json({ error: "server error occurred" });
    }
  }
);

export default router;
