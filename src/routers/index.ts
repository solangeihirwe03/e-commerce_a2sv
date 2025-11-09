import { Router } from "express";
import userRouter from "./userRoutes"

const router: Router = Router();

router.use("/auth", userRouter)

export default router