import { Router } from "express";
import { login, verify } from "../service/authService.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";

const router = Router();

router.post("/auth/login", async (request, response) => {
  try {
    const { body } = request;

    const { res } = await login(body);
    if (res === RETURN_CODES.SUCCESS) {
      return response.send({ message: "OTP send successfully" });
    } else if (res === RETURN_CODES.TOO_MANY_REQUESTS) {
      return response.status(429).json({ message: "Too many login requests" });
    } else {
      return response.status(500).json({ error: "Server error occured" });
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occured" });
  }
});

router.post("/auth/verify", async (request, response) => {
  try {
    const { body } = request;

    const { res, accessToken, refreshToken } = await verify(body);
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
      return response.status(401).json({ message: "User temporary disabled" });
    } else if (res === RETURN_CODES.USER_DELETED) {
      return response.status(401).json({ message: "User deleted" });
    } else {
      return response.status(500).json({ error: "Server error occured" });
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occured" });
  }
});

export default router;
