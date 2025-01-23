import express from 'express';
import { generateToken } from '../controllers/videoCallController.js';

export const videoCallRouter = express.Router();

videoCallRouter.post('/generate-stream-token', generateToken);
