import { Router } from "express";
import authRouter from "../authentication/authController.mjs";
import userRouter from "../user/userController.mjs";
import stylistRouter from "../stylist/stylistController.mjs";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(stylistRouter);

export default router;
