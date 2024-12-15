import { Server } from 'socket.io';

export const initSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinSession', (sessionId) => {
            socket.join(sessionId);
            io.to(sessionId).emit('newParticipant', socket.id);  // Notify other participants
        });

        socket.on('sendMessage', (message, sessionId) => {
            io.to(sessionId).emit('receiveMessage', message);  // Broadcast message to session
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
