// src/routes/streamRoutes.js
import express from 'express';
import { getStreamToken } from '../controllers/meetingsController.js';
import { verifyToken } from '../middleware/auth.js';

export const meetingsRouter = express.Router();

meetingsRouter.get('/stream/token', verifyToken, getStreamToken);
