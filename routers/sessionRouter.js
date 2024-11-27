import express from 'express';
import {
    createSession,
    getSessions,
    updateSession,
    deleteSession
} from '../controllers/sessionController.js';


export const sessionRouter = express.Router(); 

sessionRouter.get('/sessions', getSessions); // Fetch all sessions  
sessionRouter.post('/sessions', createSession); // Add new session  
sessionRouter.put('/sessions/:id', updateSession); // Update session    
sessionRouter.delete('/sessions/:id', deleteSession); // Delete session