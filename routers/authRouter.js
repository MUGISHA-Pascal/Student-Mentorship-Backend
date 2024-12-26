import express from "express";
import { jotformWebhook, loginUser, RegisterUser } from "../controllers/authController.js";

export const authRouter = express.Router();


authRouter.post("/register", RegisterUser);


authRouter.post("/login", loginUser);


authRouter.post("/form", jotformWebhook);
