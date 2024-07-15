import express from "express"
import { verifyToken } from "../middleware/auth.js"
import { getUser } from "../controllers/userController.js"
export const UserRouter = express.Router()
UserRouter.get("/",verifyToken,getUser)