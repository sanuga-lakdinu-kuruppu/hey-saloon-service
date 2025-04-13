import { Router } from "express";
import authRouter from "../../auth/controller/authController.mjs";

const router = Router();

router.use(authRouter);

export default router;
