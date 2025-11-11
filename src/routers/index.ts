import { Router } from "express";
import userRouter from "./userRoutes"
import productRouter from "./productRoutes"
import orderRouter from "./orderRoutes"

const router: Router = Router();

router.use("/auth", userRouter)
router.use("/products", productRouter)
router.use("/", orderRouter)

export default router