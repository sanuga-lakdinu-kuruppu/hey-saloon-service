import { Router } from "express";
import authRouter from "../../auth/controller/authController.mjs";
import stylistRouter from "../../stylist/controller/stylistController.mjs";
import otpVerificationRouter from "../../otpVerification/controller/otpVerificationController.mjs";

const router = Router();

router.use(authRouter);
router.use(stylistRouter);
router.use(otpVerificationRouter);

export default router;
