import { Router } from "express";
import authRouter from "../authentication/authController.mjs";
import userRouter from "../user/userController.mjs";

const router = Router();

router.use(authRouter);

export default router;
