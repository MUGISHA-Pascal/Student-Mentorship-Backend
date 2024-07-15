import express from "express";
import { loginUser, RegisterUser } from "../controllers/authController.js";

export const authRouter = express.Router();


authRouter.post("/register", RegisterUser);


authRouter.post("/login", loginUser);
