import { Router } from "express";
import { verificationMiddleware } from "../authentication/verificationMiddleware.mjs";

const router = Router();

router.get("/user", verificationMiddleware, async (request, response) => {
  try {
    const { user } = request;
    return response.send({
      status: "0000",
      status: "user retrived successfully",
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.log(`error occured ${error}`);
    return response.status(500).json({ error: "server error occred" });
  }
});

export default router;
