import express from "express"
import { verifyToken } from "../middleware/auth.js"
import { getUser } from "../controllers/userController.js"
import { generateOtp, updatePassword, validateAndVerifyOtp } from "../controllers/otp-updatePasswordController.js"
export const UserRouter = express.Router()
UserRouter.get("/",verifyToken,getUser)
UserRouter.post("/generate-otp",generateOtp)
UserRouter.get("/verify-otp",validateAndVerifyOtp)
UserRouter.patch("/update-password",updatePassword)