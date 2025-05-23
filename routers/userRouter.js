import express from "express";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";
import {
  deleteUser,
  getAllUsers,
  getEntityFromToken,
  getUser,
} from "../controllers/userController.js";
import {
  generateOtp,
  getUserById,
  updatePassword,
  validateAndVerifyOtp,
} from "../controllers/otp-updatePasswordController.js";
export const UserRouter = express.Router();
UserRouter.get("/", verifyToken, getUser);
UserRouter.post("/generate-otp", generateOtp);
UserRouter.get("/verify-otp", validateAndVerifyOtp);
UserRouter.patch("/update-password", updatePassword);
UserRouter.get("/users", verifyToken, getAllUsers);
UserRouter.delete("/:id", verifyToken, deleteUser);
UserRouter.get("/get-user/:id", getUserById);
UserRouter.get("/get-entity", verifyToken, getEntityFromToken); // Get userId from a certain table
