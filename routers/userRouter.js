import express from "express"
import { checkAdmin, verifyAdmin, verifyToken } from "../middleware/auth.js"
import { deleteUser, getAllUsers, getUser } from "../controllers/userController.js"
import { generateOtp, updatePassword, validateAndVerifyOtp } from "../controllers/otp-updatePasswordController.js"
export const UserRouter = express.Router()
UserRouter.get("/", verifyToken, getUser)
UserRouter.post("/generate-otp", generateOtp)
UserRouter.get("/verify-otp", validateAndVerifyOtp)
UserRouter.patch("/update-password", updatePassword)
UserRouter.get("/users", verifyToken, checkAdmin, getAllUsers)
UserRouter.delete("/:id", verifyToken, deleteUser)