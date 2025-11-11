import { Router } from "express";
import orderController from "../modules/orders/controller/orderController";
import { userAuthorization } from "../middleware/authorization";
import { isUserOrdersExist, validateOrderItems, validation } from "../middleware/validation";
import { placeOrderSchema } from "../modules/orders/validations/orderValidation";

const router:Router = Router();

router.post("/orders", 
    userAuthorization(["user"]),
    validateOrderItems, 
    validation(placeOrderSchema), 
    orderController.placeOrder
)

router.get("/orders-history",
    userAuthorization(["user"]),
    isUserOrdersExist,
    orderController.userGetOrderHistory
)

export default router