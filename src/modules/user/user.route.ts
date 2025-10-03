import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";


const router = Router()

router.post("/register",userController.createUser)
router.get('/me', checkAuth,userController.getMyProfile);

export const userRouter = router