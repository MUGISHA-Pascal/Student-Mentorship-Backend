import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addParticipant = async (req, res) => {
    const { sessionId, userId } = req.body;
    try {
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                participants: {
                    connect: { id: userId },
                },
            },
        });

        res.status(200).json({ message: 'Participant added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding participant' });
    }
};

export const removeParticipant = async (req, res) => {
    const { sessionId, userId } = req.body;
    try {
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                participants: {
                    disconnect: { id: userId },
                },
            },
        });

        res.status(200).json({ message: 'Participant removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing participant' });
    }
};
