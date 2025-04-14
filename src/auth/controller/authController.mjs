import { Router } from "express";
import { login, getNewAccessToken } from "../service/authService.mjs";
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

router.post("/auth/refresh", async (request, response) => {
  try {
    const { body } = request;

    const { res, accessToken, refreshToken } = await getNewAccessToken(
      body.refreshToken
    );

    if (res === RETURN_CODES.SUCCESS) {
      return response.send({
        message: "Access token generated successfully",
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else if (res === RETURN_CODES.UNAUTHORIED) {
      return response
        .status(401)
        .json({ message: "Refresh token expired or incorrect." });
    } else {
      return response.status(500).json({ error: "Server error occured" });
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occured" });
  }
});

export default router;
