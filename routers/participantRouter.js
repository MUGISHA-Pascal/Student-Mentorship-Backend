import express from 'express';
import { addParticipant, removeParticipant } from '../controllers/participantController.js';

export const participantRouter = express.Router();

participantRouter.post('/add', addParticipant);
participantRouter.delete('/remove', removeParticipant);

