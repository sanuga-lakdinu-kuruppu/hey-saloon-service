import { Router } from "express";
import { handleAuthRequest, verifyOtp } from "./authService.mjs";

const router = Router();

router.post("/auth/request", async (request, response) => {
  try {
    const data = request.body;

    const res = await handleAuthRequest(data);

    let object;
    if (res == "0000") {
      if (res === "0000") {
        object = {
          status: "0000",
          message: "otp send success",
          data: {},
        };
        console.log("otp send success");
      } else {
        object = {
          status: "1111",
          message: "otp sending failed",
          data: {},
        };
        console.log("otp send failed");
      }
      return response.send(object);
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occred" });
  }
});

router.post("/auth/verify", async (request, response) => {
  try {
    const data = request.body;

    const res = await verifyOtp(data);

    let object;
    if (res === "0000") {
      console.log("verification success");
      object = {
        status: "0000",
        message: "verification sucess",
        data: {
          accessToken: "mofaoqfntuabo2nall",
          refreshToken: "mofaoqfntuabo2nall",
          idToken: "mofaoqfntuabo2nall",
        },
      };
    } else if (res === "1112") {
      console.log("otp record not found");
      object = {
        status: "1112",
        message: "otp record not found",
        data: {},
      };
    } else if (res === "1113") {
      console.log("already verified");
      object = {
        status: "1113",
        message: "already verified",
        data: {},
      };
    } else if (res === "1114") {
      console.log("invalid otp");
      object = {
        status: "1114",
        message: "invalid otp",
        data: {},
      };
    }
    return response.send(object);
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occred" });
  }
});

export default router;
