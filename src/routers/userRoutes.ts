import { isUserExist,verifyUser, validation } from "../middleware/validation";
import userController from "../modules/users/controller/userController";
import { loginSchema, userSchema } from "../modules/users/validations/userValidations";
import { Router } from "express"

const router = Router();

router.post("/register",validation(userSchema), isUserExist, userController.registerUser );
router.post("/login",validation(loginSchema), verifyUser, userController.loginUser)

export default router