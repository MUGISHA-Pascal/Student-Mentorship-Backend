import express from "express";
import { createConsultancyRequest, createEmailSubscription } from "../controllers/subscriptionController.js";

export const subscriptionRouter = express.Router();

subscriptionRouter.post('/consultancy-request', createConsultancyRequest);

subscriptionRouter.post('/subscribe', createEmailSubscription);
