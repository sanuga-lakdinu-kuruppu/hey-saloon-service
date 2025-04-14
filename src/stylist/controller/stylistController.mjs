import { Router } from "express";
import { createStylist } from "../service/stylistService.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";

const router = Router();

router.post("/stylists", async (request, response) => {
  try {
    const { body } = request;

    const { res } = await createStylist(body);
    if (res === RETURN_CODES.SUCCESS) {
      return response.send({ message: "OTP send successfully" });
    } else if (res === RETURN_CODES.TOO_MANY_REQUESTS) {
      return response.status(429).json({ message: "Too many registration requests" });
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





export default router;
