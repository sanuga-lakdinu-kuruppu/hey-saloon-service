import { Router } from "express";
import { handleAuthRequest } from "./authService.mjs";

const router = Router();

router.post("/api/auth/request", async (request, response) => {
  try {
    const data = request.body;
    const res = await handleAuthRequest(data);
    if (res == "SUCCESS") {
      console.log("otp send success");
      return response.send({ msg: "otp send success" });
    } else {
      console.log("otp send failed");
      return response.send({ msg: "otp sending failed" });
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occred" });
  }
  return response.send({ msg: "fdjklsa" });
});

export default router;
