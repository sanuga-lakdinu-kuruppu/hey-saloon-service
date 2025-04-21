import { Router } from "express";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import {
  createPortfolio,
  getAllPortfolios,
  updateLikes,
} from "../service/portfolioService.mjs";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";

const router = Router();

router.post(
  "/portfolios",
  protectRoute(["STYLIST"]),
  async (request, response) => {
    try {
      const { body } = request;

      const { res, portfolio } = await createPortfolio(body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Portfolio created successfully",
          data: portfolio,
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
  "/portfolios",
  protectRoute(["STYLIST", "CLIENT"]),
  async (request, response) => {
    try {
      const { stylistId, clientId } = request.query;

      const { res, portfolios } = await getAllPortfolios(stylistId, clientId);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Portfolios retrived  successfully",
          data: portfolios,
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
  "/portfolios/:portfolioId/likes",
  protectRoute(["CLIENT", "STYLIST"]),
  async (request, response) => {
    try {
      const { body } = request;
      const { action } = request.query;
      const { portfolioId } = request.params;

      const { res, portfolio } = await updateLikes(
        action === "LIKED",
        body,
        portfolioId
      );
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Portfolio updated successfully",
          data: portfolio,
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
