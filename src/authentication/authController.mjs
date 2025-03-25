import { Router } from "express";
import crypto from "crypto";
import { handleAuthRequest, verifyOtp } from "./authService.mjs";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const router = Router();

const client = new CognitoIdentityProviderClient({
  region: "ap-southeast-1",
});

router.post("/auth/request", async (request, response) => {
  try {
    const data = request.body;
    const res = await handleAuthRequest(data);
    if (res == "0000") {
      console.log("otp send success");
      return response.send({ status: "0000", msg: "otp send success" });
    } else {
      console.log("otp send failed");
      return response.send({ status: "1111", msg: "otp sending failed" });
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
    if (res === "1112") {
      console.log("verification success");

      const secretHash = generateSecretHash(
        data.email,
        "35mffojn6snjkivrpbep5u50rg",
        "u7uki0ljp8m60gdgua5oi3da5h0f3runqbdmihdb1eu4ona5anb"
      );

      const command = new InitiateAuthCommand({
        AuthFlow: "CUSTOM_AUTH",
        ClientId: "35mffojn6snjkivrpbep5u50rg",
        AuthParameters: {
          EMAIL: data.email,
          SECRET_HASH: secretHash,
        },
      });

      const cognitoResponse = await client.send(command);
      console.log(cognitoResponse);

      return response.send({ status: "0000", msg: "verification sucess" });
    } else if (res === "1112") {
      console.log("otp record not found");
      return response.send({ status: "1112", msg: "otp record not found" });
    } else if (res === "1113") {
      console.log("already verified");
      return response.send({ status: "1113", msg: "already verified" });
    } else if (res === "1114") {
      console.log("invalid otp");
      return response.send({ status: "1114", msg: "invalid otp" });
    }
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occred" });
  }
});



export const generateSecretHash = (username, clientId, clientSecret) => {
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(`${username}${clientId}`);
  return hmac.digest("base64");
};

export default router;
