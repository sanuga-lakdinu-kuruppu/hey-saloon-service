import { Router } from "express";
import authRouter from "../../auth/controller/authController.mjs";
import stylistRouter from "../../stylist/controller/stylistController.mjs";
import otpVerificationRouter from "../../otpVerification/controller/otpVerificationController.mjs";
import clientRouter from "../../client/controller/clientController.mjs";
import portfolioRouter from "../../portfolio/controller/portfolioController.mjs";
import bookingRouter from "../../booking/controller/bookingController.mjs";

const router = Router();

router.use(authRouter);
router.use(stylistRouter);
router.use(otpVerificationRouter);
router.use(clientRouter);
router.use(portfolioRouter);
router.use(bookingRouter);

export default router;
