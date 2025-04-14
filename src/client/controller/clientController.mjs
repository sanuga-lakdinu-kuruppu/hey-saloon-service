import { Router } from "express";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import {
  updateClientById,
  updateWithFavouriteStylists,
} from "../service/clientService.mjs";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";

const router = Router();

router.put(
  "/clients/:clientId",
  protectRoute(["CLIENT", "STYLIST"]),
  async (request, response) => {
    try {
      const { body } = request;
      const { clientId } = request.params;

      const { res, client } = await updateClientById(clientId, body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Client updated successfully",
          data: client,
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
  "/clients/:clientId/favouriteStylists",
  protectRoute(["CLIENT", "STYLIST"]),
  async (request, response) => {
    try {
      const { body } = request;
      const { clientId } = request.params;
      const { action } = request.query;

      const { res, client } = await updateWithFavouriteStylists(
        clientId,
        action === "LIKED",
        body
      );
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Client updated successfully",
          data: client,
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
