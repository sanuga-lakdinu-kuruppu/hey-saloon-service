import { Router } from "express";
import {
  verifyRegularAuth,
  verifyStylistRegistration,
} from "../service/otpVerificationService.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";

const router = Router();

router.patch("/otp-verifications", async (request, response) => {
  try {
    const { body } = request;

    if (body.verificationType === "REGULAR_AUTH") {
      const { res, accessToken, refreshToken } = await verifyRegularAuth(body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Logged in successfully",
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });
      } else if (res === RETURN_CODES.OTP_EXPIRED) {
        return response.status(410).json({ message: "OTP expired" });
      } else if (res === RETURN_CODES.OTP_ALREADY_VERIFIED) {
        return response.status(409).json({ message: "OTP already verified" });
      } else if (res === RETURN_CODES.OTP_INVALID) {
        return response.status(401).json({ message: "OTP invalid" });
      } else if (res === RETURN_CODES.USER_DISABLED) {
        return response
          .status(401)
          .json({ message: "User temporary disabled" });
      } else if (res === RETURN_CODES.USER_DELETED) {
        return response.status(401).json({ message: "User deleted" });
      } else {
        return response.status(500).json({ error: "Server error occured" });
      }
    } else if (body.verificationType === "STYLIST_REGISTRATION") {
      const { res, accessToken, refreshToken } =
        await verifyStylistRegistration(body);
      if (res === RETURN_CODES.SUCCESS) {
        return response.send({
          message: "Stylist saved successfully",
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });
      } else if (res === RETURN_CODES.OTP_EXPIRED) {
        return response.status(410).json({ message: "OTP expired" });
      } else if (res === RETURN_CODES.OTP_ALREADY_VERIFIED) {
        return response.status(409).json({ message: "OTP already verified" });
      } else if (res === RETURN_CODES.OTP_INVALID) {
        return response.status(401).json({ message: "OTP invalid" });
      } else {
        return response.status(500).json({ error: "Server error occured" });
      }
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occured" });
  }
});

export default router;
