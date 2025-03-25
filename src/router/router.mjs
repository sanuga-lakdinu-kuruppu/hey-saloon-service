import { Router } from "express";
import authRouter from "../authentication/authController.mjs";

const router = Router();

router.use(authRouter);

export default router;
