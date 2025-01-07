import express from 'express';
import {
    scheduleSession,
} from '../controllers/sessionController.js';

export const sessionRouter = express.Router();
sessionRouter.post('/schedule', scheduleSession);