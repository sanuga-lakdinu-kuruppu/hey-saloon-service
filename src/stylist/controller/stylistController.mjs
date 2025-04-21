import { Router } from "express";
import {
  createStylist,
  updateStylistById,
  updateStylistServices,
  getAllStylists,
  updateOpenStatus,
  getStylist,
} from "../service/stylistService.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";

const router = Router();

router.post("/stylists", async (request, response) => {
  try {
    const { body } = request;

    const { res } = await createStylist(body);
    if (res === RETURN_CODES.SUCCESS) {
      return response.send({ message: "OTP send successfully" });
    } else if (res === RETURN_CODES.TOO_MANY_REQUESTS) {
      return response
        .status(429)
        .json({ message: "Too many registration requests" });
    } else if (res === RETURN_CODES.STYLIST_ALREADY_REGISTERED) {
      return response
        .status(409)
        .json({ message: "This stylist already registered" });
    } else {
      return response.status(500).json({ error: "Server error occured" });
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occured" });
  }
});

router.put(
  "/stylists/:stylistId",
  protectRoute(["STYLIST"]),
  async (request, response) => {
    try {
      const { body } = request;
      const { stylistId } = request.params;

      const { res, stylist } = await updateStylistById(stylistId, body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Stylist updated successfully",
          data: stylist,
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
  "/stylists/:stylistId/services",
  protectRoute(["STYLIST"]),
  async (request, response) => {
    try {
      const { body } = request;
      const { stylistId } = request.params;

      const { res, stylist } = await updateStylistServices(stylistId, body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Services updated successfully",
          data: stylist,
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
  "/stylists/:stylistId/isOpen",
  protectRoute(["STYLIST"]),
  async (request, response) => {
    try {
      const { stylistId } = request.params;
      const { action } = request.query;

      const { res, stylist } = await updateOpenStatus(
        stylistId,
        action === "OPENED"
      );
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Open status updated successfully",
          data: stylist,
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
  "/stylists",
  protectRoute(["STYLIST", "CLIENT"]),
  async (request, response) => {
    try {
      const { queryOn, lat, log, clientId } = request.query;

      const { res, stylists } = await getAllStylists(
        queryOn,
        lat,
        log,
        clientId
      );
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Stylists retrived  successfully",
          data: stylists,
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
  "/stylists/:stylistId",
  protectRoute(["STYLIST", "CLIENT"]),
  async (request, response) => {
    try {
      const { stylistId } = request.params;

      const { res, stylist } = await getStylist(stylistId);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Stylist retrived  successfully",
          data: stylist,
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
