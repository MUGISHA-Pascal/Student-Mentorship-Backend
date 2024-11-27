import express from 'express';
import {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage
} from '../controllers/messageController.js';

export const messageRouter = express.Router(); 


messageRouter.get('/messages', getMessages); // Fetch all messages  
messageRouter.post('/messages', createMessage); // Add new message  
messageRouter.put('/messages/:id', updateMessage); // Update message    
messageRouter.delete('/messages/:id', deleteMessage); // Delete message